import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { Card, Divider, IconButton, Snackbar } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ReviewDialog } from "@/components/ui/review-dialog";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { actorService } from "@/lib/api/actor.service";
import { userService } from "@/lib/api/user.service";
import { useAuthStore } from "@/store/auth.store";

export default function ActorDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];
	const queryClient = useQueryClient();
	const user = useAuthStore((state) => state.user);
	const [showReviewDialog, setShowReviewDialog] = useState(false);
	const [editingReview, setEditingReview] = useState<any>(null);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const { data: actor, isLoading } = useQuery({
		queryKey: ["actor", id],
		queryFn: () => actorService.getOne(Number(id)),
		enabled: !!id,
	});

	const reviewMutation = useMutation({
		mutationFn: async ({
			content,
			rating,
		}: {
			content: string;
			rating: number;
		}) => {
			if (!user) {
				throw new Error("Please sign in to write a review");
			}
			console.log("Submitting review for actor:", {
				actorId: Number(id),
				itemType: "actor",
				content,
				rating,
				isEdit: !!editingReview,
			});
			if (editingReview) {
				await userService.updateReview(Number(id), {
					itemType: "actor",
					content,
					rating,
				});
				return "updated";
			} else {
				await userService.addReview({
					itemId: Number(id),
					itemType: "actor",
					content,
					rating,
				});
				return "added";
			}
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ["actor", id] });
			setEditingReview(null);
			const message =
				action === "updated"
					? "Review updated successfully"
					: "Review added successfully";
			setSnackbarMessage(message);
			setSnackbarVisible(true);
		},
		onError: (error: any) => {
			console.error("Error submitting review:", error);
			console.error("Error details:", {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			});
			const errorMessage = error.message || "Failed to submit review";
			Alert.alert("Error", errorMessage);
		},
	});

	if (isLoading) {
		return (
			<ThemedView style={styles.container}>
				<Stack.Screen
					options={{
						title: "Loading...",
						headerStyle: { backgroundColor: colors.background },
						headerTintColor: colors.text,
						headerBackTitle: "Back",
					}}
				/>
				<View style={styles.loadingContainer}>
					<ThemedText>Loading...</ThemedText>
				</View>
			</ThemedView>
		);
	}

	if (!actor) {
		return (
			<ThemedView style={styles.container}>
				<Stack.Screen
					options={{
						title: "Not Found",
						headerStyle: { backgroundColor: colors.background },
						headerTintColor: colors.text,
						headerBackTitle: "Back",
					}}
				/>
				<View style={styles.loadingContainer}>
					<ThemedText>Actor not found</ThemedText>
				</View>
			</ThemedView>
		);
	}

	const handleWriteReview = () => {
		if (!user) {
			Alert.alert("Sign In Required", "Please sign in to write a review");
			return;
		}
		setEditingReview(null);
		setShowReviewDialog(true);
	};

	const handleSubmitReview = async (content: string, rating: number) => {
		await reviewMutation.mutateAsync({ content, rating });
	};

	return (
		<ThemedView style={styles.container}>
			<Stack.Screen
				options={{
					title: actor.fullname,
					headerStyle: { backgroundColor: colors.background },
					headerTintColor: colors.text,
					headerBackTitle: "Back",
				}}
			/>
			<ScrollView
				contentContainerStyle={[
					styles.content,
					{ backgroundColor: colors.background },
				]}
			>
				<View style={styles.header}>
					{actor.photoSrcProd && (
						<Image
							source={{ uri: actor.photoSrcProd }}
							style={styles.profile}
							resizeMode="cover"
						/>
					)}
					<View style={styles.headerInfo}>
						<ThemedText style={styles.title}>
							{actor.fullname}
						</ThemedText>
						{actor.debut && (
							<ThemedText style={styles.debut}>
								Debut: {actor.debut}
							</ThemedText>
						)}
						{actor.ratings && actor.ratings.averageRating > 0 && (
							<View style={styles.userRating}>
								<ThemedText style={styles.userRatingText}>
									Rating:{" "}
									{actor.ratings.averageRating.toFixed(1)}/5
								</ThemedText>
								<ThemedText style={styles.reviewCount}>
									({actor.ratings.totalReviews} reviews)
								</ThemedText>
							</View>
						)}
					</View>
				</View>

				{actor.description && (
					<Card
						style={[styles.card, { backgroundColor: colors.card }]}
					>
						<Card.Content>
							<ThemedText style={styles.sectionTitle}>
								Biography
							</ThemedText>
							<ThemedText style={styles.biography}>
								{actor.description}
							</ThemedText>
						</Card.Content>
					</Card>
				)}

				<Divider style={styles.divider} />
				<View style={styles.reviewsHeaderContainer}>
					<ThemedText style={styles.reviewsHeader}>
						Reviews
					</ThemedText>
					{user && (
						<IconButton
							icon="plus"
							size={24}
							iconColor={colors.primary}
							onPress={handleWriteReview}
							style={styles.addReviewButton}
						/>
					)}
				</View>
				<View style={styles.noReviews}>
					<ThemedText style={styles.noReviewsText}>
						No reviews yet
					</ThemedText>
					<ThemedText style={styles.noReviewsSubtext}>
						Be the first to share your thoughts!
					</ThemedText>
				</View>
			</ScrollView>
			<ReviewDialog
				visible={showReviewDialog}
				onDismiss={() => {
					setShowReviewDialog(false);
					setEditingReview(null);
				}}
				onSubmit={handleSubmitReview}
				initialContent={editingReview?.content || ""}
				initialRating={editingReview?.rating || 5}
				isEdit={!!editingReview}
			/>
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				duration={3000}
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					margin: 16,
					zIndex: 9999,
				}}
			>
				{snackbarMessage}
			</Snackbar>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		padding: 16,
	},
	header: {
		flexDirection: "row",
		gap: 16,
		marginBottom: 16,
		alignItems: "center",
	},
	profile: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},
	headerInfo: {
		flex: 1,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 4,
		lineHeight: 34,
	},
	debut: {
		fontSize: 16,
		opacity: 0.7,
		marginTop: 4,
	},

	card: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 8,
	},
	biography: {
		lineHeight: 22,
		opacity: 0.9,
	},
	userRating: {
		marginTop: 8,
	},
	userRatingText: {
		fontSize: 14,
		fontWeight: "600",
	},
	reviewCount: {
		fontSize: 12,
		opacity: 0.7,
		marginTop: 2,
	},
	divider: {
		marginVertical: 24,
	},
	reviewsHeaderContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	reviewsHeader: {
		fontSize: 24,
		fontWeight: "bold",
	},
	addReviewButton: {
		margin: 0,
	},
	noReviews: {
		padding: 32,
		alignItems: "center",
	},
	noReviewsText: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 8,
	},
	noReviewsSubtext: {
		fontSize: 14,
		opacity: 0.7,
	},
});
