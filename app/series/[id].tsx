import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { Card, Chip, IconButton } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { serieService } from "@/lib/api/serie.service";
import { userService } from "@/lib/api/user.service";
import { formatDate } from "@/utils/format.utils";

export default function SerieDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];
	const queryClient = useQueryClient();

	const { data: serie, isLoading } = useQuery({
		queryKey: ["serie", id],
		queryFn: () => serieService.getOne(Number(id)),
		enabled: !!id,
	});

	const bookmarkMutation = useMutation({
		mutationFn: async (isBookmarked: boolean) => {
			if (isBookmarked) {
				await userService.removeFavorite(1, Number(id));
			} else {
				await userService.addFavorite(1, Number(id), "serie");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["serie", id] });
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

	if (!serie) {
		return (
			<ThemedView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ThemedText>Series not found</ThemedText>
				</View>
			</ThemedView>
		);
	}

	const handleBookmark = () => {
		bookmarkMutation.mutate(!!serie.isBookmarked);
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
				{serie.photoSrcProd && (
					<Image
						source={{ uri: serie.photoSrcProd }}
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
						{serie.photoSrc && (
							<Image
								source={{ uri: serie.photoSrc }}
								style={styles.poster}
								resizeMode="cover"
							/>
						)}
						<View style={styles.headerInfo}>
							<ThemedText style={styles.title}>
								{serie.title}
							</ThemedText>
							<View style={styles.metaRow}>
								{serie.dateAired && (
									<ThemedText style={styles.metaText}>
										{formatDate(serie.dateAired)}
									</ThemedText>
								)}
							</View>
							{serie.ratingImdb && (
								<View style={styles.ratingContainer}>
									<IconButton
										icon="star"
										size={20}
										iconColor={colors.accent}
										style={styles.starIcon}
									/>
									<ThemedText style={styles.ratingText}>
										{serie.ratingImdb.toFixed(1)} / 10
									</ThemedText>
								</View>
							)}
							{serie.ratings &&
								serie.ratings.averageRating > 0 && (
									<View style={styles.userRating}>
										<ThemedText
											style={styles.userRatingText}
										>
											User Rating:{" "}
											{serie.ratings.averageRating.toFixed(
												1,
											)}
											/5
										</ThemedText>
										<ThemedText style={styles.reviewCount}>
											({serie.ratings.totalReviews}{" "}
											reviews)
										</ThemedText>
									</View>
								)}
						</View>
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

					<Card
						style={[styles.card, { backgroundColor: colors.card }]}
					>
						<Card.Content>
							<ThemedText style={styles.sectionTitle}>
								Description
							</ThemedText>
							<ThemedText style={styles.overview}>
								{serie.description ||
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
