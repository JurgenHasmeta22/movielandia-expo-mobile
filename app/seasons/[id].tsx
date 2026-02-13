import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { Chip, Divider, IconButton, List, Snackbar } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Review } from "@/components/ui/review";
import { ReviewDialog } from "@/components/ui/review-dialog";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { episodeService } from "@/lib/api/episode.service";
import { seasonService } from "@/lib/api/season.service";
import { userService } from "@/lib/api/user.service";
import { useAuthStore } from "@/store/auth.store";

export default function SeasonDetailScreen() {
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

	const { data: season, isLoading } = useQuery({
		queryKey: ["season", id],
		queryFn: () => seasonService.getOne(Number(id)),
		enabled: !!id,
	});

	const { data: episodesData } = useQuery({
		queryKey: ["episodes", "season", id],
		queryFn: () => episodeService.getBySeason(Number(id)),
		enabled: !!id,
	});

	const bookmarkMutation = useMutation({
		mutationFn: async (isBookmarked: boolean) => {
			if (!user) {
				throw new Error("Please sign in to bookmark");
			}
			if (isBookmarked) {
				await userService.removeFavorite(Number(id), "seasons");
				return "removed";
			} else {
				await userService.addFavorite(Number(id), "seasons");
				return "added";
			}
		},
		onSuccess: (action) => {
			queryClient.invalidateQueries({ queryKey: ["season", id] });
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
					"season",
					reviewData,
				);
			} else {
				await userService.addReview(Number(id), "season", reviewData);
			}
			queryClient.invalidateQueries({ queryKey: ["season", id] });
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
								"season",
							);
							queryClient.invalidateQueries({
								queryKey: ["season", id],
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

	if (!season) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Season not found</ThemedText>
			</ThemedView>
		);
	}

	const episodes: any[] = (episodesData as any)?.episodes || [];

	return (
		<>
			<Stack.Screen
				options={{
					title: season.title,
					headerStyle: { backgroundColor: colors.background },
					headerTintColor: colors.text,
					headerBackTitle: "Back",
				}}
			/>
			<ThemedView style={styles.container}>
				<ScrollView>
					<Image
						source={{
							uri: season.photoSrcProd || season.photoSrc,
						}}
						style={styles.poster}
						resizeMode="cover"
					/>

					<View style={styles.content}>
						<ThemedText type="title" style={styles.title}>
							{season.title}
						</ThemedText>

						<View style={styles.metaContainer}>
							<Chip icon="calendar" style={styles.chip}>
								{season.dateAired
									? format(
											new Date(season.dateAired),
											"MMM yyyy",
										)
									: "TBA"}
							</Chip>
							<Chip icon="star" style={styles.chip}>
								{season.ratingImdb?.toFixed(1) || "N/A"}
							</Chip>
							{season.ratings && (
								<Chip icon="account-group" style={styles.chip}>
									{season.ratings.averageRating.toFixed(1)} (
									{season.ratings.totalReviews})
								</Chip>
							)}
						</View>

						<View style={styles.actions}>
							<IconButton
								icon={
									season.isBookmarked
										? "bookmark"
										: "bookmark-outline"
								}
								size={28}
								iconColor={
									season.isBookmarked
										? colors.primary
										: colors.text
								}
								onPress={() =>
									bookmarkMutation.mutate(
										!!season.isBookmarked,
									)
								}
								style={[
									styles.actionButton,
									{ backgroundColor: colors.card },
								]}
							/>
						</View>

						<ThemedText style={styles.description}>
							{season.description}
						</ThemedText>

						<Divider style={styles.divider} />

						<View style={styles.sectionHeader}>
							<ThemedText type="subtitle">
								Episodes ({episodes.length})
							</ThemedText>
						</View>

						{episodes.map((episode) => (
							<TouchableOpacity
								key={episode.id}
								onPress={() => {
									router.push(
										`/seasons/episodes/${episode.id}` as any,
									);
								}}
							>
								<List.Item
									title={episode.title}
									description={`${episode.duration} min • ${episode.ratingImdb?.toFixed(1)} ⭐`}
									left={() => (
										<Image
											source={{
												uri:
													episode.photoSrcProd ||
													episode.photoSrc,
											}}
											style={styles.episodeThumb}
										/>
									)}
									right={(props) => (
										<List.Icon
											{...props}
											icon="chevron-right"
										/>
									)}
									style={[
										styles.episodeItem,
										{
											backgroundColor: colors.card,
										},
									]}
								/>
							</TouchableOpacity>
						))}

						<Divider style={styles.divider} />

						<View style={styles.sectionHeader}>
							<ThemedText type="subtitle">Reviews</ThemedText>
							{user && !season.isReviewed && (
								<IconButton
									icon="plus"
									size={20}
									onPress={handleAddReview}
								/>
							)}
						</View>

						{season.reviews && season.reviews.length > 0 ? (
							season.reviews.map((review) => (
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
	episodeItem: {
		marginBottom: 8,
		borderRadius: 8,
	},
	episodeThumb: {
		width: 80,
		height: 60,
		borderRadius: 4,
		marginRight: 12,
	},
	noReviews: {
		textAlign: "center",
		opacity: 0.5,
		paddingVertical: 24,
	},
});
