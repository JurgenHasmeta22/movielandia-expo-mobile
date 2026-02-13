import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Chip, IconButton, Searchbar } from "react-native-paper";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { actorService } from "@/lib/api/actor.service";
import { crewService } from "@/lib/api/crew.service";
import { movieService } from "@/lib/api/movie.service";
import { serieService } from "@/lib/api/serie.service";
import { getImageUrl } from "@/utils/image.utils";

type SearchType = "all" | "movies" | "series" | "actors" | "crew";

export default function SearchScreen() {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [searchType, setSearchType] = useState<SearchType>("all");
	const flatListRef = useRef<FlatList>(null);

	const { data: moviesData, isLoading: moviesLoading } = useQuery({
		queryKey: ["movies-search", debouncedQuery],
		queryFn: () =>
			movieService.search(debouncedQuery, { page: 1, perPage: 10 }),
		enabled:
			debouncedQuery.length > 2 &&
			(searchType === "all" || searchType === "movies"),
	});

	const { data: seriesData, isLoading: seriesLoading } = useQuery({
		queryKey: ["series-search", debouncedQuery],
		queryFn: () =>
			serieService.search(debouncedQuery, { page: 1, perPage: 10 }),
		enabled:
			debouncedQuery.length > 2 &&
			(searchType === "all" || searchType === "series"),
	});

	const { data: actorsData, isLoading: actorsLoading } = useQuery({
		queryKey: ["actors-search", debouncedQuery],
		queryFn: () =>
			actorService.search(debouncedQuery, { page: 1, perPage: 10 }),
		enabled:
			debouncedQuery.length > 2 &&
			(searchType === "all" || searchType === "actors"),
	});

	const { data: crewData, isLoading: crewLoading } = useQuery({
		queryKey: ["crew-search", debouncedQuery],
		queryFn: () =>
			crewService.search(debouncedQuery, { page: 1, perPage: 10 }),
		enabled:
			debouncedQuery.length > 2 &&
			(searchType === "all" || searchType === "crew"),
	});

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, 500);
		return () => clearTimeout(timer);
	};

	const isLoading =
		moviesLoading || seriesLoading || actorsLoading || crewLoading;

	const totalResults =
		(searchType === "all" || searchType === "movies"
			? moviesData?.count || 0
			: 0) +
		(searchType === "all" || searchType === "series"
			? seriesData?.count || 0
			: 0) +
		(searchType === "all" || searchType === "actors"
			? actorsData?.count || 0
			: 0) +
		(searchType === "all" || searchType === "crew"
			? crewData?.count || 0
			: 0);

	const scrollToTop = () => {
		flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
	};

	const renderMovieItem = ({ item }: { item: any }) => (
		<TouchableOpacity
			onPress={() => router.push(`/movies/${item.id}`)}
			style={styles.cardWrapper}
		>
			<Card style={[styles.card, { backgroundColor: colors.card }]}>
				<Card.Cover
					source={{
						uri: getImageUrl(item.photoSrcProd || item.photoSrc),
					}}
					style={styles.cardImage}
				/>
				<Card.Content style={styles.cardContent}>
					<ThemedText
						type="defaultSemiBold"
						numberOfLines={2}
						style={styles.cardTitle}
					>
						{item.title}
					</ThemedText>
					{item.ratingImdb && (
						<ThemedText style={styles.rating}>
							⭐ {item.ratingImdb.toFixed(1)}
						</ThemedText>
					)}
				</Card.Content>
			</Card>
		</TouchableOpacity>
	);

	const renderSerieItem = ({ item }: { item: any }) => (
		<TouchableOpacity
			onPress={() => router.push(`/series/${item.id}`)}
			style={styles.cardWrapper}
		>
			<Card style={[styles.card, { backgroundColor: colors.card }]}>
				<Card.Cover
					source={{
						uri: getImageUrl(item.photoSrcProd || item.photoSrc),
					}}
					style={styles.cardImage}
				/>
				<Card.Content style={styles.cardContent}>
					<ThemedText
						type="defaultSemiBold"
						numberOfLines={2}
						style={styles.cardTitle}
					>
						{item.title}
					</ThemedText>
					{item.ratingImdb && (
						<ThemedText style={styles.rating}>
							⭐ {item.ratingImdb.toFixed(1)}
						</ThemedText>
					)}
				</Card.Content>
			</Card>
		</TouchableOpacity>
	);

	const renderActorItem = ({ item }: { item: any }) => (
		<TouchableOpacity
			onPress={() => router.push(`/actors/${item.id}`)}
			style={styles.cardWrapper}
		>
			<Card style={[styles.card, { backgroundColor: colors.card }]}>
				<Card.Cover
					source={{
						uri: getImageUrl(item.photoSrcProd || item.photoSrc),
					}}
					style={styles.cardImage}
				/>
				<Card.Content style={styles.cardContent}>
					<ThemedText
						type="defaultSemiBold"
						numberOfLines={2}
						style={styles.cardTitle}
					>
						{item.fullname}
					</ThemedText>
				</Card.Content>
			</Card>
		</TouchableOpacity>
	);

	const renderCrewItem = ({ item }: { item: any }) => (
		<TouchableOpacity
			onPress={() => router.push(`/crew/${item.id}`)}
			style={styles.cardWrapper}
		>
			<Card style={[styles.card, { backgroundColor: colors.card }]}>
				<Card.Cover
					source={{
						uri: getImageUrl(item.photoSrcProd || item.photoSrc),
					}}
					style={styles.cardImage}
				/>
				<Card.Content style={styles.cardContent}>
					<ThemedText
						type="defaultSemiBold"
						numberOfLines={2}
						style={styles.cardTitle}
					>
						{item.fullname}
					</ThemedText>
					{item.role && (
						<ThemedText style={styles.role} numberOfLines={1}>
							{item.role}
						</ThemedText>
					)}
				</Card.Content>
			</Card>
		</TouchableOpacity>
	);

	return (
		<ThemedView style={styles.container}>
			<View style={styles.searchContainer}>
				<Searchbar
					placeholder="Search movies, series, actors..."
					onChangeText={handleSearchChange}
					value={searchQuery}
					style={[styles.searchBar, { backgroundColor: colors.card }]}
				/>

				<View style={styles.filterContainer}>
					<Chip
						selected={searchType === "all"}
						onPress={() => setSearchType("all")}
						style={styles.chip}
					>
						All ({totalResults})
					</Chip>
					<Chip
						selected={searchType === "movies"}
						onPress={() => setSearchType("movies")}
						style={styles.chip}
					>
						Movies ({moviesData?.count || 0})
					</Chip>
					<Chip
						selected={searchType === "series"}
						onPress={() => setSearchType("series")}
						style={styles.chip}
					>
						Series ({seriesData?.count || 0})
					</Chip>
					<Chip
						selected={searchType === "actors"}
						onPress={() => setSearchType("actors")}
						style={styles.chip}
					>
						Actors ({actorsData?.count || 0})
					</Chip>
					<Chip
						selected={searchType === "crew"}
						onPress={() => setSearchType("crew")}
						style={styles.chip}
					>
						Crew ({crewData?.count || 0})
					</Chip>
				</View>
			</View>

			{debouncedQuery.length > 2 && totalResults > 0 && (
				<View style={styles.resultsHeader}>
					<ThemedText style={styles.resultsCount}>
						{totalResults} result{totalResults !== 1 ? "s" : ""}{" "}
						found
					</ThemedText>
				</View>
			)}

			<FlatList
				ref={flatListRef}
				contentContainerStyle={styles.content}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						{isLoading ? (
							<ThemedText>Searching...</ThemedText>
						) : debouncedQuery.length > 2 ? (
							<ThemedText>No results found</ThemedText>
						) : (
							<ThemedText>Start typing to search</ThemedText>
						)}
					</View>
				}
				data={[
					...(searchType === "all" || searchType === "movies"
						? moviesData?.movies || []
						: []
					).map((item: any) => ({ ...item, type: "movie" })),
					...(searchType === "all" || searchType === "series"
						? seriesData?.series || []
						: []
					).map((item: any) => ({ ...item, type: "serie" })),
					...(searchType === "all" || searchType === "actors"
						? actorsData?.actors || []
						: []
					).map((item: any) => ({ ...item, type: "actor" })),
					...(searchType === "all" || searchType === "crew"
						? crewData?.crew || []
						: []
					).map((item: any) => ({ ...item, type: "crew" })),
				]}
				renderItem={({ item }) => {
					if (item.type === "movie") return renderMovieItem({ item });
					if (item.type === "serie") return renderSerieItem({ item });
					if (item.type === "actor") return renderActorItem({ item });
					if (item.type === "crew") return renderCrewItem({ item });
					return null;
				}}
				keyExtractor={(item) => `${item.type}-${item.id}`}
				numColumns={2}
				columnWrapperStyle={styles.row}
			/>

			{debouncedQuery.length > 2 && totalResults > 10 && (
				<IconButton
					icon="arrow-up"
					size={24}
					iconColor="#fff"
					onPress={scrollToTop}
					style={[
						styles.scrollTopButton,
						{ backgroundColor: colors.primary },
					]}
				/>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchContainer: {
		padding: 16,
		paddingBottom: 8,
	},
	searchBar: {
		elevation: 2,
		marginBottom: 12,
	},
	filterContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	chip: {
		marginBottom: 4,
	},
	resultsHeader: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(128, 128, 128, 0.2)",
	},
	resultsCount: {
		fontSize: 14,
		fontWeight: "600",
		opacity: 0.7,
	},
	content: {
		padding: 8,
		paddingTop: 12,
	},
	row: {
		justifyContent: "space-between",
		paddingHorizontal: 8,
		marginBottom: 12,
	},
	cardWrapper: {
		width: "47%",
	},
	card: {
		elevation: 2,
		borderRadius: 6,
		overflow: "hidden",
	},
	cardImage: {
		height: 100,
	},
	cardContent: {
		paddingVertical: 4,
		paddingHorizontal: 4,
		minHeight: 40,
	},
	cardTitle: {
		fontSize: 11,
		lineHeight: 13,
		marginBottom: 1,
	},
	rating: {
		fontSize: 9,
		marginTop: 1,
	},
	role: {
		fontSize: 9,
		marginTop: 1,
		opacity: 0.7,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 48,
	},
	scrollTopButton: {
		position: "absolute",
		right: 16,
		bottom: 16,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
});
