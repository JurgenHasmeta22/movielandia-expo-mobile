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
import { movieService } from "@/lib/api/movie.service";
import { userService } from "@/lib/api/user.service";
import { useAuthStore } from "@/store/auth.store";
import { formatDate, formatRuntime } from "@/utils/format.utils";

export default function MovieDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];

	const queryClient = useQueryClient();

	const user = useAuthStore((state) => state.user);

	const [showReviewDialog, setShowReviewDialog] = useState(false);
	const [editingReview, setEditingReview] = useState<any>(null);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const { data: movie, isLoading } = useQuery({
		queryKey: ["movie", id],
		queryFn: () => movieService.getOne(Number(id)),
		enabled: !!id,
	});

	const bookmarkMutation = useMutation({
		mutationFn: async (isBookmarked: boolean) => {
			if (!user) {
				throw new Error("Please sign in to bookmark");
			}

			if (isBookmarked) {
				await userService.removeFavorite(Number(id), "movies");
				return "removed";
			} else {
				await userService.addFavorite(Number(id), "movies");
				return "added";
			}
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ["movie", id] });

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
				await userService.updateReview(Number(id), "movie", {
					content,
					rating,
				});

				return "updated";
			} else {
				await userService.addReview(Number(id), "movie", {
					content,
					rating,
				});

				return "added";
			}
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ["movie", id] });

			setEditingReview(null);
			
			const message =
				action === "updated"
					? "Review updated successfully"
					: "Review added successfully";

			setSnackbarMessage(message);
			setSnackbarVisible(true);
		},
		onError: (error: any) => {
			Alert.alert("Error", error.message || "Failed to submit review");
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

	if (!movie) {
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
					<ThemedText>Movie not found</ThemedText>
				</View>
			</ThemedView>
		);
	}

	const handleBookmark = () => {
		if (!user) {
			Alert.alert(
				"Sign In Required",
				"Please sign in to bookmark movies",
			);
			return;
		}
		bookmarkMutation.mutate(!!movie.isBookmarked);
	};

	const handleWriteReview = () => {
		if (!user) {
			Alert.alert("Sign In Required", "Please sign in to write a review");
			return;
		}
		setEditingReview(null);
		setShowReviewDialog(true);
	};

	const handleEditReview = (review: any) => {
		setEditingReview(review);
		setShowReviewDialog(true);
	};

	const handleDeleteReview = () => {
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
							await userService.deleteReview(Number(id), "movie");
							queryClient.invalidateQueries({
								queryKey: ["movie", id],
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

	const handleSubmitReview = async (content: string, rating: number) => {
		await reviewMutation.mutateAsync({ content, rating });
		setShowReviewDialog(false);
	};

	return (
		<ThemedView style={styles.container}>
			<Stack.Screen
				options={{
					title: movie.title,
					headerStyle: { backgroundColor: colors.background },
					headerTintColor: colors.text,
					headerBackTitle: "Back",
				}}
			/>
			<ScrollView>
				{movie.photoSrcProd && (
					<Image
						source={{ uri: movie.photoSrcProd }}
						style={styles.poster}
						resizeMode="cover"
					/>
				)}

				<View style={styles.content}>
					<ThemedText type="title" style={styles.title}>
						{movie.title}
					</ThemedText>

					<View style={styles.metaContainer}>
						{movie.dateAired && (
							<Chip icon="calendar" style={styles.chip}>
								{formatDate(movie.dateAired)}
							</Chip>
						)}
						{movie.duration && (
							<Chip icon="clock-outline" style={styles.chip}>
								{formatRuntime(movie.duration)}
							</Chip>
						)}
						{movie.ratingImdb && (
							<Chip icon="star" style={styles.chip}>
								{movie.ratingImdb.toFixed(1)}
							</Chip>
						)}
						{movie.ratings && movie.ratings.averageRating > 0 && (
							<Chip icon="account-group" style={styles.chip}>
								{movie.ratings.averageRating.toFixed(1)} (
								{movie.ratings.totalReviews})
							</Chip>
						)}
					</View>

					<View style={styles.actions}>
						<IconButton
							icon={
								movie.isBookmarked
									? "bookmark"
									: "bookmark-outline"
							}
							size={28}
							iconColor={
								movie.isBookmarked
									? colors.primary
									: colors.text
							}
							onPress={handleBookmark}
							style={[
								styles.actionButton,
								{ backgroundColor: colors.card },
							]}
						/>
					</View>

					{movie.genres && movie.genres.length > 0 && (
						<View style={styles.genres}>
							{movie.genres.map((genre) => (
								<Chip
									key={genre.id}
									style={[
										styles.genreChip,
										{ backgroundColor: colors.card },
									]}
									textStyle={{ color: colors.text }}
								>
									{genre.name}
								</Chip>
							))}
						</View>
					)}

					<ThemedText style={styles.description}>
						{movie.description || "No description available"}
					</ThemedText>

					<Divider style={styles.divider} />
					<View style={styles.reviewsHeaderContainer}>
						<ThemedText style={styles.reviewsHeader}>
							Reviews
						</ThemedText>
						{user && !movie.isReviewed && (
							<IconButton
								icon="plus"
								size={20}
								iconColor={colors.primary}
								onPress={handleWriteReview}
								style={styles.addReviewButton}
							/>
						)}
					</View>

					{movie.reviews && movie.reviews.length > 0 ? (
						movie.reviews.map((review) => (
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
				</View>
			</ScrollView>

			<ReviewDialog
				visible={showReviewDialog}
				onDismiss={() => {
					setShowReviewDialog(false);
					setEditingReview(null);
				}}
				onSubmit={handleSubmitReview}
				initialContent={editingReview?.content}
				initialRating={editingReview?.rating}
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
	genres: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginBottom: 16,
	},
	genreChip: {},
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
