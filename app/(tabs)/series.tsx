import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Chip } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MediaCard } from "@/components/ui/media-card";
import { genreService } from "@/lib/api/genre.service";
import { serieService } from "@/lib/api/serie.service";

export default function SeriesScreen() {
	const [page, setPage] = useState(1);
	const [selectedGenre, setSelectedGenre] = useState<number | undefined>();
	const [refreshing, setRefreshing] = useState(false);

	const {
		data: series,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["series", page, selectedGenre],
		queryFn: () =>
			serieService.getAll({ page, perPage: 20, genreId: selectedGenre }),
	});

	const { data: genres } = useQuery({
		queryKey: ["genres"],
		queryFn: () => genreService.getAll(),
	});

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.genresContainer}
				contentContainerStyle={styles.genresContent}
			>
				<Chip
					selected={!selectedGenre}
					onPress={() => setSelectedGenre(undefined)}
					style={styles.chip}
				>
					All
				</Chip>
				{genres &&
					Array.isArray(genres) &&
					genres.map((genre) => (
						<Chip
							key={genre.id}
							selected={selectedGenre === genre.id}
							onPress={() => setSelectedGenre(genre.id)}
							style={styles.chip}
						>
							{genre.name}
						</Chip>
					))}
			</ScrollView>

			<ScrollView
				contentContainerStyle={styles.content}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			>
				{isLoading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" />
						<ThemedText style={styles.loadingText}>
							Loading series...
						</ThemedText>
					</View>
				) : isError ? (
					<View style={styles.loadingContainer}>
						<ThemedText style={styles.errorText}>
							Error loading series. Pull to refresh.
						</ThemedText>
					</View>
				) : (series?.series || []).length === 0 ? (
					<View style={styles.loadingContainer}>
						<ThemedText style={styles.emptyText}>
							No series found.
						</ThemedText>
					</View>
				) : (
					<View style={styles.grid}>
						{series?.series &&
							Array.isArray(series.series) &&
							series.series.map((serie) => (
								<MediaCard
									key={serie.id}
									id={serie.id}
									title={serie.title}
									photoSrcProd={serie.photoSrcProd}
									dateAired={serie.dateAired}
									ratingImdb={serie.ratingImdb}
									ratings={serie.ratings}
									description={serie.description}
									type="series"
									isBookmarked={serie.isBookmarked}
								/>
							))}
					</View>
				)}

				{series && series.count > 20 && (
					<View style={styles.pagination}>
						<Button
							mode="contained"
							onPress={() => setPage(page - 1)}
							disabled={page === 1}
						>
							Previous
						</Button>
						<ThemedText>Page {page}</ThemedText>
						<Button
							mode="contained"
							onPress={() => setPage(page + 1)}
							disabled={(series?.series?.length || 0) < 20}
						>
							Next
						</Button>
					</View>
				)}
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	genresContainer: {
		maxHeight: 60,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
	},
	genresContent: {
		padding: 12,
		gap: 8,
	},
	chip: {
		marginRight: 4,
	},
	content: {
		padding: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 40,
	},
	loadingText: {
		marginTop: 12,
		opacity: 0.7,
	},
	errorText: {
		color: "#f44336",
		opacity: 0.9,
	},
	emptyText: {
		opacity: 0.7,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 8,
	},
	gridItem: {
		width: "48%",
	},
	pagination: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 24,
		gap: 16,
	},
});
