import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { Chip, Divider, IconButton, Snackbar } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Review } from "@/components/ui/review";
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

	const bookmarkMutation = useMutation({
		mutationFn: async (isBookmarked: boolean) => {
			if (!user) {
				throw new Error("Please sign in to bookmark");
			}
			if (isBookmarked) {
				await userService.removeFavorite(Number(id), "actors");
				return "removed";
			} else {
				await userService.addFavorite(Number(id), "actors");
				return "added";
			}
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ["actor", id] });
			const message =
				action === "added"
					? "Bookmark added successfully"
					: "Bookmark removed successfully";
			setSnackbarMessage(message);
			setSnackbarVisible(true);
		},
		onError: (error: any) => {
			Alert.alert("Error", error.message || "Failed to update bookmark");
		},
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
			if (editingReview) {
				await userService.updateReview(Number(id), "actor", {
					content,
					rating,
				});
				return "updated";
			} else {
				await userService.addReview(Number(id), "actor", {
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

	const handleBookmark = () => {
		if (!user) {
			Alert.alert(
				"Sign In Required",
				"Please sign in to bookmark actors",
			);
			return;
		}
		bookmarkMutation.mutate(!!actor.isBookmarked);
	};

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
		setShowReviewDialog(false);
	};

	const handleEditReview = (review: any) => {
		setEditingReview(review);
		setShowReviewDialog(true);
	};

	const handleDeleteReview = async () => {
		if (!user) return;
		Alert.alert(
			"Delete Review",
			"Are you sure you want to delete this review?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							await userService.deleteReview(Number(id), "actor");
							queryClient.invalidateQueries({
								queryKey: ["actor", id],
							});
							setSnackbarMessage("Review deleted");
							setSnackbarVisible(true);
						} catch (error: any) {
							Alert.alert(
								"Error",
								error.message || "Failed to delete review",
							);
						}
					},
				},
			],
		);
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
				{actor.photoSrcProd && (
					<View style={styles.profileContainer}>
						<Image
							source={{ uri: actor.photoSrcProd }}
							style={styles.profile}
							resizeMode="cover"
						/>
					</View>
				)}

				<ThemedText type="title" style={styles.title}>
					{actor.fullname}
				</ThemedText>

				<View style={styles.metaContainer}>
					{actor.debut && (
						<Chip icon="calendar" style={styles.chip}>
							{actor.debut}
						</Chip>
					)}
					{actor.ratings && actor.ratings.averageRating > 0 && (
						<Chip icon="account-group" style={styles.chip}>
							{actor.ratings.averageRating.toFixed(1)} (
							{actor.ratings.totalReviews})
						</Chip>
					)}
				</View>

				<View style={styles.actions}>
					<IconButton
						icon={
							actor.isBookmarked ? "bookmark" : "bookmark-outline"
						}
						size={28}
						iconColor={
							actor.isBookmarked ? colors.primary : colors.text
						}
						onPress={handleBookmark}
						style={[
							styles.actionButton,
							{ backgroundColor: colors.card },
						]}
					/>
				</View>

				{actor.description && (
					<ThemedText style={styles.description}>
						{actor.description}
					</ThemedText>
				)}

				<Divider style={styles.divider} />
				<View style={styles.reviewsHeaderContainer}>
					<ThemedText style={styles.reviewsHeader}>
						Reviews
					</ThemedText>
					{user && (
						<IconButton
							icon={actor.isReviewed ? "pencil" : "plus"}
							size={20}
							iconColor={colors.primary}
							onPress={handleWriteReview}
							style={styles.addReviewButton}
						/>
					)}
				</View>
				{actor.reviews && actor.reviews.length > 0 ? (
					actor.reviews.map((review) => (
						<Review
							key={review.id}
							review={review}
							onEdit={
								user?.id === review.user.id
									? () => handleEditReview(review)
									: undefined
							}
							onDelete={
								user?.id === review.user.id
									? handleDeleteReview
									: undefined
							}
						/>
					))
				) : (
					<View style={styles.noReviews}>
						<ThemedText style={styles.noReviewsText}>
							No reviews yet
						</ThemedText>
						<ThemedText style={styles.noReviewsSubtext}>
							Be the first to share your thoughts!
						</ThemedText>
					</View>
				)}
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
	profileContainer: {
		alignItems: "center",
		marginBottom: 16,
	},
	profile: {
		width: 150,
		height: 150,
		borderRadius: 75,
	},
	title: {
		textAlign: "center",
		marginBottom: 12,
	},
	metaContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: 8,
		marginBottom: 16,
	},
	chip: {},
	actions: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 12,
		marginBottom: 16,
	},
	actionButton: {
		borderRadius: 12,
	},
	description: {
		lineHeight: 20,
		marginBottom: 16,
	},
	divider: {
		marginVertical: 16,
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
