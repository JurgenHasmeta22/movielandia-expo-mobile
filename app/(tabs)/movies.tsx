import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	FlatList,
	RefreshControl,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { ActivityIndicator, Chip } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MediaCard } from "@/components/ui/media-card";
import { genreService } from "@/lib/api/genre.service";
import { movieService } from "@/lib/api/movie.service";

export default function MoviesScreen() {
	const [selectedGenre, setSelectedGenre] = useState<number | undefined>();
	const [refreshing, setRefreshing] = useState(false);

	const {
		data,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ["movies", selectedGenre],
		queryFn: ({ pageParam = 1 }) =>
			movieService.getAll({
				page: pageParam,
				perPage: 20,
				genreId: selectedGenre,
			}),
		getNextPageParam: (lastPage, allPages) => {
			const currentPage = allPages.length;
			const totalPages = Math.ceil((lastPage.count || 0) / 20);
			return currentPage < totalPages ? currentPage + 1 : undefined;
		},
		initialPageParam: 1,
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

	const movies = data?.pages.flatMap((page) => page.movies || []) || [];

	const handleLoadMore = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const renderFooter = () => {
		if (!isFetchingNextPage) return null;
		return (
			<View style={styles.footer}>
				<ActivityIndicator size="large" color="#e50914" />
				<ThemedText style={styles.loadingText}>
					Loading more movies...
				</ThemedText>
			</View>
		);
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
			) : movies.length === 0 ? (
				<View style={styles.loadingContainer}>
					<ThemedText style={styles.emptyText}>
						No movies found.
					</ThemedText>
				</View>
			) : (
				<FlatList
					data={movies}
					keyExtractor={(item) => `movie-${item.id}`}
					numColumns={2}
					columnWrapperStyle={styles.row}
					contentContainerStyle={styles.content}
					renderItem={({ item }) => (
						<View style={styles.gridItem}>
							<MediaCard
								key={item.id}
								id={item.id}
								title={item.title}
								photoSrcProd={item.photoSrcProd}
								dateAired={item.dateAired}
								ratingImdb={item.ratingImdb}
								ratings={item.ratings}
								description={item.description}
								type="movie"
								isBookmarked={item.isBookmarked}
							/>
						</View>
					)}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5}
					ListFooterComponent={renderFooter}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
				/>
			)}
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
	row: {
		justifyContent: "space-between",
	},
	gridItem: {
		width: "48%",
		marginBottom: 16,
	},
	footer: {
		paddingVertical: 20,
		alignItems: "center",
	},
});
