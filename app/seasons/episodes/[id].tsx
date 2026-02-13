import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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

import { episodeService } from "@/lib/api/episode.service";
import { userService } from "@/lib/api/user.service";
import { useAuthStore } from "@/store/auth.store";

export default function EpisodeDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];
	const queryClient = useQueryClient();
	const user = useAuthStore((state) => state.user);
	const [showReviewDialog, setShowReviewDialog] = useState(false);
	const [editingReview, setEditingReview] = useState<any>(null);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const { data: episode, isLoading } = useQuery({
		queryKey: ["episode", id],
		queryFn: () => episodeService.getOne(Number(id)),
		enabled: !!id,
	});

	const bookmarkMutation = useMutation({
		mutationFn: async (isBookmarked: boolean) => {
			if (!user) {
				throw new Error("Please sign in to bookmark");
			}
			if (isBookmarked) {
				await userService.removeFavorite(Number(id), "episodes");
				return "removed";
			} else {
				await userService.addFavorite(Number(id), "episodes");
				return "added";
			}
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ["episode", id] });
			const message =
				action === "added"
					? "Added to bookmarks"
					: "Removed from bookmarks";
			setSnackbarMessage(message);
			setSnackbarVisible(true);
		},
		onError: (error: any) => {
			Alert.alert("Error", error.message || "Failed to update bookmark");
		},
	});

	const handleAddReview = () => {
		if (!user) {
			Alert.alert("Sign In Required", "Please sign in to add a review");
			return;
		}
		setEditingReview(null);
		setShowReviewDialog(true);
	};

	const handleEditReview = (review: any) => {
		setEditingReview(review);
		setShowReviewDialog(true);
	};

	const handleSaveReview = async (reviewData: {
		rating: number;
		content: string;
	}) => {
		try {
			if (editingReview) {
				await userService.updateReview(
					Number(id),
					"episode",
					reviewData,
				);
			} else {
				await userService.addReview(Number(id), "episode", reviewData);
			}
			queryClient.invalidateQueries({ queryKey: ["episode", id] });
			setShowReviewDialog(false);
			setEditingReview(null);
			setSnackbarMessage(
				editingReview ? "Review updated" : "Review added",
			);
			setSnackbarVisible(true);
		} catch (error: any) {
			Alert.alert("Error", error.message || "Failed to save review");
		}
	};

	const handleDeleteReview = async (reviewId: number) => {
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
							await userService.deleteReview(
								Number(id),
								"episode",
							);
							queryClient.invalidateQueries({
								queryKey: ["episode", id],
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

	if (isLoading) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Loading...</ThemedText>
			</ThemedView>
		);
	}

	if (!episode) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Episode not found</ThemedText>
			</ThemedView>
		);
	}

	return (
		<>
			<Stack.Screen
				options={{
					title: episode.title,
					headerStyle: { backgroundColor: colors.background },
					headerTintColor: colors.text,
					headerBackTitle: "Back",
				}}
			/>
			<ThemedView style={styles.container}>
				<ScrollView>
					<Image
						source={{
							uri: episode.photoSrcProd || episode.photoSrc,
						}}
						style={styles.poster}
						resizeMode="cover"
					/>

					<View style={styles.content}>
						<ThemedText type="title" style={styles.title}>
							{episode.title}
						</ThemedText>

						<View style={styles.metaContainer}>
							<Chip icon="calendar" style={styles.chip}>
								{episode.dateAired
									? format(
											new Date(episode.dateAired),
											"MMM dd, yyyy",
										)
									: "TBA"}
							</Chip>
							<Chip icon="clock-outline" style={styles.chip}>
								{episode.duration} min
							</Chip>
							<Chip icon="star" style={styles.chip}>
								{episode.ratingImdb?.toFixed(1) || "N/A"}
							</Chip>
							{episode.ratings && (
								<Chip icon="account-group" style={styles.chip}>
									{episode.ratings.averageRating.toFixed(1)} (
									{episode.ratings.totalReviews})
								</Chip>
							)}
						</View>

						<View style={styles.actions}>
							<IconButton
								icon={
									episode.isBookmarked
										? "bookmark"
										: "bookmark-outline"
								}
								size={28}
								iconColor={
									episode.isBookmarked
										? colors.primary
										: colors.text
								}
								onPress={() =>
									bookmarkMutation.mutate(
										!!episode.isBookmarked,
									)
								}
								style={[
									styles.actionButton,
									{ backgroundColor: colors.card },
								]}
							/>
						</View>

						<ThemedText style={styles.description}>
							{episode.description}
						</ThemedText>

						<Divider style={styles.divider} />

						<View style={styles.sectionHeader}>
							<ThemedText type="subtitle">Reviews</ThemedText>
							{user && !episode.isReviewed && (
								<IconButton
									icon="plus"
									size={20}
									onPress={handleAddReview}
								/>
							)}
						</View>

						{episode.reviews && episode.reviews.length > 0 ? (
							episode.reviews.map((review) => (
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
											? () =>
													handleDeleteReview(
														review.id,
													)
											: undefined
									}
								/>
							))
						) : (
							<ThemedText style={styles.noReviews}>
								No reviews yet
							</ThemedText>
						)}
					</View>
				</ScrollView>

				<ReviewDialog
					visible={showReviewDialog}
					onDismiss={() => setShowReviewDialog(false)}
					onSubmit={async (content, rating) => {
						await handleSaveReview({ content, rating });
					}}
					initialRating={editingReview?.rating}
					initialContent={editingReview?.content}
					isEdit={!!editingReview}
				/>

				<Snackbar
					visible={snackbarVisible}
					onDismiss={() => setSnackbarVisible(false)}
					duration={3000}
				>
					<ThemedText>{snackbarMessage}</ThemedText>
				</Snackbar>
			</ThemedView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	poster: {
		width: "100%",
		height: 300,
	},
	content: {
		padding: 16,
	},
	title: {
		marginBottom: 12,
	},
	metaContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginBottom: 16,
	},
	chip: {},
	actions: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 16,
	},
	actionButton: {
		margin: 0,
	},
	description: {
		lineHeight: 20,
		marginBottom: 16,
	},
	divider: {
		marginVertical: 16,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	noReviews: {
		textAlign: "center",
		opacity: 0.5,
		paddingVertical: 24,
	},
});
