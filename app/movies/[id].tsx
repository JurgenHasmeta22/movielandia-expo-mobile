import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { Card, Chip, Divider, IconButton, Snackbar } from "react-native-paper";

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

	const deleteReviewMutation = useMutation({
		mutationFn: async () => {
			if (!user) {
				throw new Error("Please sign in");
			}
			await userService.deleteReview(Number(id), "movie");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["movie", id] });
		},
		onError: (error: any) => {
			Alert.alert("Error", error.message || "Failed to delete review");
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
					onPress: () => deleteReviewMutation.mutate(),
				},
			],
		);
	};

	const handleSubmitReview = async (content: string, rating: number) => {
		await reviewMutation.mutateAsync({ content, rating });
	};

	const userReview = (movie as any).reviews?.find(
		(r: any) => r.user.id === user?.id,
	);
	const otherReviews = (movie as any).reviews?.filter(
		(r: any) => r.user.id !== user?.id,
	);

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
						style={styles.backdrop}
						resizeMode="cover"
					/>
				)}

				<View
					style={[
						styles.content,
						{ backgroundColor: colors.background },
					]}
				>
					<View style={styles.header}>
						{movie.photoSrc && (
							<Image
								source={{ uri: movie.photoSrc }}
								style={styles.poster}
								resizeMode="cover"
							/>
						)}
						<View style={styles.headerInfo}>
							<ThemedText style={styles.title}>
								{movie.title}
							</ThemedText>
							<View style={styles.metaRow}>
								{movie.dateAired && (
									<ThemedText style={styles.metaText}>
										{formatDate(movie.dateAired)}
									</ThemedText>
								)}
								{movie.duration && (
									<ThemedText style={styles.metaText}>
										• {formatRuntime(movie.duration)}
									</ThemedText>
								)}
							</View>
							{movie.ratingImdb && (
								<View style={styles.ratingContainer}>
									<IconButton
										icon="star"
										size={20}
										iconColor={colors.accent}
										style={styles.starIcon}
									/>
									<ThemedText style={styles.ratingText}>
										{movie.ratingImdb.toFixed(1)} / 10
									</ThemedText>
								</View>
							)}
							{movie.ratings &&
								movie.ratings.averageRating > 0 && (
									<View style={styles.userRating}>
										<ThemedText
											style={styles.userRatingText}
										>
											User Rating:{" "}
											{movie.ratings.averageRating.toFixed(
												1,
											)}
											/5
										</ThemedText>
										<ThemedText style={styles.reviewCount}>
											({movie.ratings.totalReviews}{" "}
											reviews)
										</ThemedText>
									</View>
								)}
						</View>
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

					<Card
						style={[styles.card, { backgroundColor: colors.card }]}
					>
						<Card.Content>
							<ThemedText style={styles.sectionTitle}>
								Description
							</ThemedText>
							<ThemedText style={styles.overview}>
								{movie.description ||
									"No description available"}
							</ThemedText>
						</Card.Content>
					</Card>

					{(movie as any).reviews &&
						(movie as any).reviews.length > 0 && (
							<>
								<Divider style={styles.divider} />
								<View style={styles.reviewsHeaderContainer}>
									<ThemedText style={styles.reviewsHeader}>
										User Reviews (
										{(movie as any).reviews.length})
									</ThemedText>
									{!userReview && user && (
										<IconButton
											icon="plus"
											size={24}
											iconColor={colors.primary}
											onPress={handleWriteReview}
											style={styles.addReviewButton}
										/>
									)}
								</View>

								{userReview && (
									<>
										<ThemedText style={styles.yourReview}>
											Your Review
										</ThemedText>
										<Review
											review={userReview}
											onEdit={() =>
												handleEditReview(userReview)
											}
											onDelete={handleDeleteReview}
										/>
									</>
								)}

								{otherReviews && otherReviews.length > 0 && (
									<>
										{userReview && (
											<ThemedText
												style={styles.otherReviews}
											>
												Other Reviews
											</ThemedText>
										)}
										{otherReviews.map((review: any) => (
											<Review
												key={review.id}
												review={review}
											/>
										))}
									</>
								)}
							</>
						)}

					{(movie as any).reviews &&
						(movie as any).reviews.length === 0 && (
							<>
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
							</>
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
	backdrop: {
		width: "100%",
		height: 240,
	},
	content: {
		padding: 16,
	},
	header: {
		flexDirection: "row",
		gap: 16,
		marginBottom: 16,
	},
	poster: {
		width: 120,
		height: 180,
		borderRadius: 8,
	},
	headerInfo: {
		flex: 1,
		justifyContent: "flex-start",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 8,
		lineHeight: 34,
	},
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
		gap: 4,
	},
	metaText: {
		fontSize: 14,
		opacity: 0.8,
	},
	ratingContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 4,
		marginLeft: -8,
	},
	starIcon: {
		margin: 0,
		padding: 0,
	},
	ratingText: {
		fontSize: 16,
		fontWeight: "600",
		marginLeft: -4,
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
	genreChip: {
		height: 32,
	},
	card: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 8,
	},
	overview: {
		lineHeight: 22,
		opacity: 0.9,
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
	yourReview: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 12,
	},
	otherReviews: {
		fontSize: 16,
		fontWeight: "600",
		marginTop: 8,
		marginBottom: 12,
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
