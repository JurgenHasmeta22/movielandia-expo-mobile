import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { serieService } from "@/lib/api/serie.service";
import { formatDate } from "@/utils/format.utils";

export default function SerieDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: serie, isLoading } = useQuery({
		queryKey: ["serie", id],
		queryFn: () => serieService.getOne(Number(id)),
		enabled: !!id,
	});

	if (isLoading) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Loading...</ThemedText>
			</ThemedView>
		);
	}

	if (!serie) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Series not found</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ScrollView>
				{serie.photoSrcProd && (
					<Image
						source={{ uri: serie.photoSrcProd }}
						style={styles.backdrop}
					/>
				)}

				<View style={styles.content}>
					<View style={styles.header}>
						{serie.photoSrc && (
							<Image
								source={{
									uri: serie.photoSrc,
								}}
								style={styles.poster}
							/>
						)}
						<View style={styles.headerInfo}>
							<ThemedText type="title" style={styles.title}>
								{serie.title}
							</ThemedText>
							<View style={styles.meta}>
								{serie.ratingImdb && (
									<Chip icon="star" style={styles.chip}>
										{serie.ratingImdb.toFixed(1)}
									</Chip>
								)}
								{serie.dateAired && (
									<Chip style={styles.chip}>
										{formatDate(serie.dateAired)}
									</Chip>
								)}
							</View>
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

					{serie.genres && serie.genres.length > 0 && (
						<View style={styles.genres}>
							{serie.genres.map((genre) => (
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
								{serie.description ||
									"No description available"}
							</ThemedText>
						</Card.Content>
					</Card>

					{serie.trailerSrc && (
						<Card style={styles.card}>
							<Card.Content>
								<ThemedText type="subtitle">Trailer</ThemedText>
								<ThemedText style={styles.detailRow}>
									Available
								</ThemedText>
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
