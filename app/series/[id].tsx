import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Chip, Divider, IconButton, Snackbar } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Review } from "@/components/ui/review";
import { ReviewDialog } from "@/components/ui/review-dialog";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { seasonService } from "@/lib/api/season.service";
import { serieService } from "@/lib/api/serie.service";
import { userService } from "@/lib/api/user.service";
import { useAuthStore } from "@/store/auth.store";
import { formatDate } from "@/utils/format.utils";

export default function SerieDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];
	const queryClient = useQueryClient();
	const user = useAuthStore((state) => state.user);
	const [showReviewDialog, setShowReviewDialog] = useState(false);
	const [editingReview, setEditingReview] = useState<any>(null);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const { data: serie, isLoading } = useQuery({
		queryKey: ["serie", id],
		queryFn: () => serieService.getOne(Number(id)),
		enabled: !!id,
	});

	const { data: seasonsData } = useQuery({
		queryKey: ["seasons", "serie", id],
		queryFn: () => seasonService.getBySerie(Number(id)),
		enabled: !!id,
	});

	const bookmarkMutation = useMutation({
		mutationFn: async (isBookmarked: boolean) => {
			if (!user) {
				throw new Error("Please sign in to bookmark");
			}
			if (isBookmarked) {
				await userService.removeFavorite(Number(id), "series");
				return "removed";
			} else {
				await userService.addFavorite(Number(id), "series");
				return "added";
			}
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ["serie", id] });
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
				await userService.updateReview(Number(id), "serie", {
					content,
					rating,
				});
				return "updated";
			} else {
				await userService.addReview(Number(id), "serie", {
					content,
					rating,
				});
				return "added";
			}
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ["serie", id] });
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
			await userService.deleteReview(Number(id), "serie");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["serie", id] });
			setSnackbarMessage("Review deleted");
			setSnackbarVisible(true);
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

	if (!serie) {
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
					<ThemedText>Series not found</ThemedText>
				</View>
			</ThemedView>
		);
	}

	const handleBookmark = () => {
		if (!user) {
			Alert.alert(
				"Sign In Required",
				"Please sign in to bookmark series",
			);
			return;
		}
		bookmarkMutation.mutate(!!serie.isBookmarked);
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
		setShowReviewDialog(false);
	};

	const seasons: any[] = (seasonsData as any)?.seasons || [];

	return (
		<ThemedView style={styles.container}>
			<Stack.Screen
				options={{
					title: serie.title,
					headerStyle: { backgroundColor: colors.background },
					headerTintColor: colors.text,
					headerBackTitle: "Back",
				}}
			/>
			<ScrollView>
				{serie.photoSrcProd && (
					<Image
						source={{ uri: serie.photoSrcProd }}
						style={styles.poster}
						resizeMode="cover"
					/>
				)}

				<View style={styles.content}>
					<ThemedText type="title" style={styles.title}>
						{serie.title}
					</ThemedText>

					<View style={styles.metaContainer}>
						{serie.dateAired && (
							<Chip icon="calendar" style={styles.chip}>
								{formatDate(serie.dateAired)}
							</Chip>
						)}
						{serie.ratingImdb && (
							<Chip icon="star" style={styles.chip}>
								{serie.ratingImdb.toFixed(1)}
							</Chip>
						)}
						{serie.ratings && serie.ratings.averageRating > 0 && (
							<Chip icon="account-group" style={styles.chip}>
								{serie.ratings.averageRating.toFixed(1)} (
								{serie.ratings.totalReviews})
							</Chip>
						)}
					</View>

					<View style={styles.actions}>
						<IconButton
							icon={
								serie.isBookmarked
									? "bookmark"
									: "bookmark-outline"
							}
							size={28}
							iconColor={
								serie.isBookmarked
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

					{serie.genres && serie.genres.length > 0 && (
						<View style={styles.genres}>
							{serie.genres.map((genre) => (
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
						{serie.description || "No description available"}
					</ThemedText>

					{seasons.length > 0 && (
						<>
							<Divider style={styles.divider} />

							<View style={styles.sectionHeader}>
								<ThemedText type="subtitle">
									Seasons ({seasons.length})
								</ThemedText>
							</View>

							{seasons.map((season) => (
								<TouchableOpacity
									key={season.id}
									onPress={() => {
										router.push(
											`/seasons/${season.id}` as any,
										);
									}}
								>
									<View
										style={[
											styles.seasonCard,
											{ backgroundColor: colors.card },
										]}
									>
										<Image
											source={{
												uri:
													season.photoSrcProd ||
													season.photoSrc,
											}}
											style={styles.seasonPoster}
											resizeMode="cover"
										/>
										<View style={styles.seasonInfo}>
											<ThemedText type="defaultSemiBold">
												{season.title}
											</ThemedText>
											<ThemedText
												style={styles.seasonMeta}
											>
												⭐{" "}
												{season.ratingImdb?.toFixed(
													1,
												) || "N/A"}
											</ThemedText>
											{season.dateAired && (
												<ThemedText
													style={styles.seasonMeta}
												>
													{formatDate(
														season.dateAired,
													)}
												</ThemedText>
											)}
										</View>
										<IconButton
											icon="chevron-right"
											size={24}
										/>
									</View>
								</TouchableOpacity>
							))}
						</>
					)}

					<Divider style={styles.divider} />
					<View style={styles.reviewsHeaderContainer}>
						<ThemedText style={styles.reviewsHeader}>
							Reviews
						</ThemedText>
						{user && !serie.isReviewed && (
							<IconButton
								icon="plus"
								size={20}
								iconColor={colors.primary}
								onPress={handleWriteReview}
								style={styles.addReviewButton}
							/>
						)}
					</View>

					{serie.reviews && serie.reviews.length > 0 ? (
						serie.reviews.map((review) => (
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
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	seasonCard: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		marginBottom: 12,
		borderRadius: 8,
	},
	seasonPoster: {
		width: 80,
		height: 120,
		borderRadius: 4,
		marginRight: 12,
	},
	seasonInfo: {
		flex: 1,
	},
	seasonMeta: {
		fontSize: 12,
		opacity: 0.7,
		marginTop: 4,
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
