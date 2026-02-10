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
import { SortFilter, SortOption } from "@/components/ui/sort-filter";
import { genreService } from "@/lib/api/genre.service";
import { serieService } from "@/lib/api/serie.service";

const sortOptions: SortOption[] = [
	{ value: "title", label: "Title" },
	{ value: "dateAired", label: "Air Date" },
	{ value: "ratingImdb", label: "Rating" },
];

export default function SeriesScreen() {
	const [selectedGenre, setSelectedGenre] = useState<number | undefined>();
	const [sortBy, setSortBy] = useState("title");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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
		queryKey: ["series", selectedGenre, sortBy, sortOrder],
		queryFn: ({ pageParam = 1 }) =>
			serieService.getAll({
				page: pageParam,
				perPage: 20,
				genreId: selectedGenre,
				sortBy,
				ascOrDesc: sortOrder,
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

	const series = data?.pages.flatMap((page) => page.series || []) || [];

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
					Loading more series...
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

			<SortFilter
				sortOptions={sortOptions}
				selectedSort={sortBy}
				sortOrder={sortOrder}
				onSortChange={setSortBy}
				onOrderChange={() =>
					setSortOrder(sortOrder === "asc" ? "desc" : "asc")
				}
			/>

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
			) : series.length === 0 ? (
				<View style={styles.loadingContainer}>
					<ThemedText style={styles.emptyText}>
						No series found.
					</ThemedText>
				</View>
			) : (
				<FlatList
					data={series}
					keyExtractor={(item) => `serie-${item.id}`}
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
								type="series"
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
	},
	footer: {
		paddingVertical: 20,
		alignItems: "center",
	},
});
