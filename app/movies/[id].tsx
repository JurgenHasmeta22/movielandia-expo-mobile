import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { movieService } from "@/lib/api/movie.service";
import {
    formatDate,
    formatRuntime
} from "@/utils/format.utils";

export default function MovieDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: movie, isLoading } = useQuery({
		queryKey: ["movie", id],
		queryFn: () => movieService.getOne(Number(id)),
		enabled: !!id,
	});

	if (isLoading) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Loading...</ThemedText>
			</ThemedView>
		);
	}

	if (!movie) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Movie not found</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ScrollView>
				{movie.photoSrcProd && (
					<Image
						source={{ uri: movie.photoSrcProd }}
						style={styles.backdrop}
					/>
				)}

				<View style={styles.content}>
					<View style={styles.header}>
						{movie.photoSrc && (
							<Image
								source={{
									uri: movie.photoSrc,
								}}
								style={styles.poster}
							/>
						)}
						<View style={styles.headerInfo}>
							<ThemedText type="title" style={styles.title}>
								{movie.title}
							</ThemedText>
							<View style={styles.meta}>
								{movie.ratingImdb && (
									<Chip icon="star" style={styles.chip}>
										{movie.ratingImdb.toFixed(1)}
									</Chip>
								)}
								{movie.dateAired && (
									<Chip style={styles.chip}>
										{formatDate(movie.dateAired)}
									</Chip>
								)}
							</View>
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

					{movie.genres && movie.genres.length > 0 && (
						<View style={styles.genres}>
							{movie.genres.map((genre) => (
								<Chip key={genre.id} style={styles.genreChip}>
									{genre.name}
								</Chip>
							))}
						</View>
					)}

					<Card style={styles.card}>
						<Card.Content>
							<ThemedText type="subtitle">Description</ThemedText>
							<ThemedText style={styles.overview}>
								{movie.description ||
									"No description available"}
							</ThemedText>
						</Card.Content>
					</Card>

					{movie.duration && (
						<Card style={styles.card}>
							<Card.Content>
								<ThemedText type="subtitle">Details</ThemedText>
								<View style={styles.detailRow}>
									<ThemedText style={styles.detailLabel}>
										Runtime:
									</ThemedText>
									<ThemedText>
										{formatRuntime(movie.duration)}
									</ThemedText>
								</View>
							</Card.Content>
						</Card>
					)}

					<View style={styles.actions}>
						<Button mode="contained" icon="heart">
							Add to Favorites
						</Button>
						<Button mode="contained" icon="bookmark">
							Add to Watchlist
						</Button>
						<Button mode="outlined" icon="star">
							Write Review
						</Button>
					</View>
				</View>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backdrop: {
		width: "100%",
		height: 200,
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
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		marginBottom: 4,
	},
	originalTitle: {
		fontSize: 14,
		opacity: 0.7,
		marginBottom: 8,
	},
	meta: {
		flexDirection: "row",
		gap: 8,
		marginTop: 8,
	},
	chip: {
		height: 32,
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
	overview: {
		marginTop: 8,
		lineHeight: 22,
	},
	detailRow: {
		flexDirection: "row",
		marginTop: 8,
	},
	detailLabel: {
		fontWeight: "600",
		marginRight: 8,
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
		gap: 12,
		marginTop: 16,
	},
});
