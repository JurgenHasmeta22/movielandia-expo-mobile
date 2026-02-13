import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Review } from "@/components/ui/review";
import { ReviewDialog } from "@/components/ui/review-dialog";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { crewService } from "@/lib/api/crew.service";
import { userService } from "@/lib/api/user.service";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { Chip, Divider, IconButton, Snackbar } from "react-native-paper";

export default function CrewDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];

	const queryClient = useQueryClient();

	const user = useAuthStore((state) => state.user);

	const [showReviewDialog, setShowReviewDialog] = useState(false);
	const [editingReview, setEditingReview] = useState<any>(null);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const { data: crew, isLoading } = useQuery({
		queryKey: ["crew", id],
		queryFn: () => crewService.getOne(Number(id)),
		enabled: !!id,
	});

	const bookmarkMutation = useMutation({
		mutationFn: async (isBookmarked: boolean) => {
			if (!user) {
				throw new Error("Please sign in to bookmark");
			}

			if (isBookmarked) {
				await userService.removeFavorite(Number(id), "crew");
				return "removed";
			} else {
				await userService.addFavorite(Number(id), "crew");
				return "added";
			}
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ["crew", id] });

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
				await userService.updateReview(Number(id), "crew", {
					content,
					rating,
				});

				return "updated";
			} else {
				await userService.addReview(Number(id), "crew", {
					content,
					rating,
				});

				return "added";
			}
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ["crew", id] });

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

	if (!crew) {
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
					<ThemedText>Crew member not found</ThemedText>
				</View>
			</ThemedView>
		);
	}

	const handleBookmark = () => {
		if (!user) {
			Alert.alert(
				"Sign In Required",
				"Please sign in to bookmark crew members",
			);

			return;
		}

		bookmarkMutation.mutate(!!crew.isBookmarked);
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
							await userService.deleteReview(Number(id), "crew");

							queryClient.invalidateQueries({
								queryKey: ["crew", id],
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
					title: crew.fullname,
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
				{crew.photoSrcProd && (
					<View style={styles.profileContainer}>
						<Image
							source={{ uri: crew.photoSrcProd }}
							style={styles.profile}
							resizeMode="cover"
						/>
					</View>
				)}

				<ThemedText type="title" style={styles.title}>
					{crew.fullname}
				</ThemedText>

				<View style={styles.metaContainer}>
					{crew.debut && (
						<Chip icon="calendar" style={styles.chip}>
							{crew.debut}
						</Chip>
					)}
					{crew.ratings && crew.ratings.averageRating > 0 && (
						<Chip icon="account-group" style={styles.chip}>
							{crew.ratings.averageRating.toFixed(1)} (
							{crew.ratings.totalReviews})
						</Chip>
					)}
				</View>

				<View style={styles.actions}>
					<IconButton
						icon={
							crew.isBookmarked ? "bookmark" : "bookmark-outline"
						}
						size={28}
						iconColor={
							crew.isBookmarked ? colors.primary : colors.text
						}
						onPress={handleBookmark}
						style={[
							styles.actionButton,
							{ backgroundColor: colors.card },
						]}
					/>
				</View>

				{crew.description && (
					<ThemedText style={styles.description}>
						{crew.description}
					</ThemedText>
				)}

				<Divider style={styles.divider} />
				<View style={styles.reviewsHeaderContainer}>
					<ThemedText style={styles.reviewsHeader}>
						Reviews
					</ThemedText>
					{user && !crew.isReviewed && (
						<IconButton
							icon="plus"
							size={20}
							iconColor={colors.primary}
							onPress={handleWriteReview}
							style={styles.addReviewButton}
						/>
					)}
				</View>
				{crew.reviews && crew.reviews.length > 0 ? (
					crew.reviews.map((review) => (
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
				<ThemedText>{snackbarMessage}</ThemedText>
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
