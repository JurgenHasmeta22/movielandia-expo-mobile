import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { Card, Chip, IconButton } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { movieService } from "@/lib/api/movie.service";
import { userService } from "@/lib/api/user.service";
import { formatDate, formatRuntime } from "@/utils/format.utils";

export default function MovieDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];
	const queryClient = useQueryClient();
	const [showReviewDialog, setShowReviewDialog] = useState(false);

	const { data: movie, isLoading } = useQuery({
		queryKey: ["movie", id],
		queryFn: () => movieService.getOne(Number(id)),
		enabled: !!id,
	});

	const bookmarkMutation = useMutation({
		mutationFn: async (isBookmarked: boolean) => {
			if (isBookmarked) {
				await userService.removeFavorite(1, Number(id));
			} else {
				await userService.addFavorite(1, Number(id), "movie");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["movie", id] });
		},
		onError: (error) => {
			Alert.alert("Error", "Failed to update bookmark");
		},
	});

	if (isLoading) {
		return (
			<ThemedView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ThemedText>Loading...</ThemedText>
				</View>
			</ThemedView>
		);
	}

	if (!movie) {
		return (
			<ThemedView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ThemedText>Movie not found</ThemedText>
				</View>
			</ThemedView>
		);
	}

	const handleBookmark = () => {
		bookmarkMutation.mutate(!!movie.isBookmarked);
	};

	const handleWriteReview = () => {
		Alert.alert("Write Review", "Review functionality coming soon!", [
			{
				text: "OK",
				onPress: () => console.log("Review dialog"),
			},
		]);
	};

	return (
		<ThemedView style={styles.container}>
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
						<IconButton
							icon="pencil"
							size={28}
							iconColor={colors.text}
							onPress={handleWriteReview}
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
				</View>
			</ScrollView>
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
});
