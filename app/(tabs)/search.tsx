import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Chip, Searchbar } from "react-native-paper";

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

	const renderMovieItem = ({ item }: { item: any }) => (
		<TouchableOpacity onPress={() => router.push(`/movies/${item.id}`)}>
			<Card style={[styles.card, { backgroundColor: colors.card }]}>
				<Card.Cover
					source={{
						uri: getImageUrl(item.photoSrcProd || item.photoSrc),
					}}
				/>
				<Card.Content style={styles.cardContent}>
					<ThemedText type="defaultSemiBold">{item.title}</ThemedText>
					<ThemedText style={styles.rating}>
						⭐ {item.ratingImdb?.toFixed(1) || "N/A"}
					</ThemedText>
				</Card.Content>
			</Card>
		</TouchableOpacity>
	);

	const renderSerieItem = ({ item }: { item: any }) => (
		<TouchableOpacity onPress={() => router.push(`/series/${item.id}`)}>
			<Card style={[styles.card, { backgroundColor: colors.card }]}>
				<Card.Cover
					source={{
						uri: getImageUrl(item.photoSrcProd || item.photoSrc),
					}}
				/>
				<Card.Content style={styles.cardContent}>
					<ThemedText type="defaultSemiBold">{item.title}</ThemedText>
					<ThemedText style={styles.rating}>
						⭐ {item.ratingImdb?.toFixed(1) || "N/A"}
					</ThemedText>
				</Card.Content>
			</Card>
		</TouchableOpacity>
	);

	const renderActorItem = ({ item }: { item: any }) => (
		<TouchableOpacity onPress={() => router.push(`/actors/${item.id}`)}>
			<Card style={[styles.card, { backgroundColor: colors.card }]}>
				<Card.Cover
					source={{
						uri: getImageUrl(item.photoSrcProd || item.photoSrc),
					}}
				/>
				<Card.Content style={styles.cardContent}>
					<ThemedText type="defaultSemiBold">
						{item.fullname}
					</ThemedText>
				</Card.Content>
			</Card>
		</TouchableOpacity>
	);

	const renderCrewItem = ({ item }: { item: any }) => (
		<TouchableOpacity onPress={() => router.push(`/crew/${item.id}`)}>
			<Card style={[styles.card, { backgroundColor: colors.card }]}>
				<Card.Cover
					source={{
						uri: getImageUrl(item.photoSrcProd || item.photoSrc),
					}}
				/>
				<Card.Content style={styles.cardContent}>
					<ThemedText type="defaultSemiBold">
						{item.fullname}
					</ThemedText>
					<ThemedText style={styles.role}>{item.role}</ThemedText>
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
						All
					</Chip>
					<Chip
						selected={searchType === "movies"}
						onPress={() => setSearchType("movies")}
						style={styles.chip}
					>
						Movies
					</Chip>
					<Chip
						selected={searchType === "series"}
						onPress={() => setSearchType("series")}
						style={styles.chip}
					>
						Series
					</Chip>
					<Chip
						selected={searchType === "actors"}
						onPress={() => setSearchType("actors")}
						style={styles.chip}
					>
						Actors
					</Chip>
					<Chip
						selected={searchType === "crew"}
						onPress={() => setSearchType("crew")}
						style={styles.chip}
					>
						Crew
					</Chip>
				</View>
			</View>

			<FlatList
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
						? moviesData?.data || []
						: []
					).map((item) => ({ ...item, type: "movie" })),
					...(searchType === "all" || searchType === "series"
						? seriesData?.data || []
						: []
					).map((item) => ({ ...item, type: "serie" })),
					...(searchType === "all" || searchType === "actors"
						? actorsData?.data || []
						: []
					).map((item) => ({ ...item, type: "actor" })),
					...(searchType === "all" || searchType === "crew"
						? crewData?.data || []
						: []
					).map((item) => ({ ...item, type: "crew" })),
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
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchContainer: {
		padding: 16,
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
	content: {
		padding: 16,
		paddingTop: 0,
	},
	row: {
		justifyContent: "space-between",
		marginBottom: 16,
	},
	card: {
		width: "48%",
		marginBottom: 8,
	},
	cardContent: {
		paddingTop: 12,
	},
	rating: {
		fontSize: 12,
		marginTop: 4,
	},
	role: {
		fontSize: 12,
		marginTop: 4,
		opacity: 0.7,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 48,
	},
});
