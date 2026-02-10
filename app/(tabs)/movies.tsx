import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Chip } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MediaCard } from "@/components/ui/media-card";
import { genreService } from "@/lib/api/genre.service";
import { movieService } from "@/lib/api/movie.service";

export default function MoviesScreen() {
	const [page, setPage] = useState(1);
	const [selectedGenre, setSelectedGenre] = useState<number | undefined>();
	const [refreshing, setRefreshing] = useState(false);

	const {
		data: movies,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["movies", page, selectedGenre],
		queryFn: () =>
			movieService.getAll({ page, perPage: 20, genreId: selectedGenre }),
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
							Loading movies...
						</ThemedText>
					</View>
				) : isError ? (
					<View style={styles.loadingContainer}>
						<ThemedText style={styles.errorText}>
							Error loading movies. Pull to refresh.
						</ThemedText>
					</View>
				) : (movies?.movies || []).length === 0 ? (
					<View style={styles.loadingContainer}>
						<ThemedText style={styles.emptyText}>
							No movies found.
						</ThemedText>
					</View>
				) : (
					<View style={styles.grid}>
						{movies?.movies &&
							Array.isArray(movies.movies) &&
							movies.movies.map((movie) => (
								<MediaCard
									key={movie.id}
									id={movie.id}
									title={movie.title}
									photoSrcProd={movie.photoSrcProd}
									dateAired={movie.dateAired}
									ratingImdb={movie.ratingImdb}
									ratings={movie.ratings}
									description={movie.description}
									type="movie"
									isBookmarked={movie.isBookmarked}
								/>
							))}
					</View>
				)}

				{movies && movies.count > 20 && (
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
							disabled={(movies?.movies?.length || 0) < 20}
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
