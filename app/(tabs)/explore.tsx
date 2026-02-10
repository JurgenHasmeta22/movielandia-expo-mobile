import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Searchbar, SegmentedButtons } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { actorService } from "@/lib/api/actor.service";
import { movieService } from "@/lib/api/movie.service";
import { serieService } from "@/lib/api/serie.service";

export default function SearchScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchType, setSearchType] = useState("movies");

	const { data: movieResults, isLoading: moviesLoading } = useQuery({
		queryKey: ["movies", "search", searchQuery],
		queryFn: () => movieService.search(searchQuery),
		enabled: searchType === "movies" && searchQuery.length > 0,
	});

	const { data: serieResults, isLoading: seriesLoading } = useQuery({
		queryKey: ["series", "search", searchQuery],
		queryFn: () => serieService.search(searchQuery),
		enabled: searchType === "series" && searchQuery.length > 0,
	});

	const { data: actorResults, isLoading: actorsLoading } = useQuery({
		queryKey: ["actors", "search", searchQuery],
		queryFn: () => actorService.search(searchQuery),
		enabled: searchType === "actors" && searchQuery.length > 0,
	});

	const isLoading = moviesLoading || seriesLoading || actorsLoading;

	return (
		<ThemedView style={styles.container}>
			<View style={styles.header}>
				<Searchbar
					placeholder="Search..."
					onChangeText={setSearchQuery}
					value={searchQuery}
					style={styles.searchbar}
				/>

				<SegmentedButtons
					value={searchType}
					onValueChange={setSearchType}
					buttons={[
						{ value: "movies", label: "Movies" },
						{ value: "series", label: "Series" },
						{ value: "actors", label: "Actors" },
					]}
					style={styles.segmented}
				/>
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				{!searchQuery ? (
					<ThemedView style={styles.emptyState}>
						<ThemedText type="subtitle">
							Start searching...
						</ThemedText>
						<ThemedText style={styles.emptyText}>
							Enter a search term to find movies, series, or
							actors
						</ThemedText>
					</ThemedView>
				) : isLoading ? (
					<ThemedText>Loading...</ThemedText>
				) : (
					<ThemedView>
						{searchType === "movies" &&
							movieResults?.data.length === 0 && (
								<ThemedText>No movies found</ThemedText>
							)}
						{searchType === "series" &&
							serieResults?.data.length === 0 && (
								<ThemedText>No series found</ThemedText>
							)}
						{searchType === "actors" &&
							actorResults?.data.length === 0 && (
								<ThemedText>No actors found</ThemedText>
							)}

						{searchType === "movies" &&
							movieResults?.data.map((movie) => (
								<ThemedView
									key={movie.id}
									style={styles.resultItem}
								>
									<ThemedText type="defaultSemiBold">
										{movie.title}
									</ThemedText>
								</ThemedView>
							))}

						{searchType === "series" &&
							serieResults?.data.map((serie) => (
								<ThemedView
									key={serie.id}
									style={styles.resultItem}
								>
									<ThemedText type="defaultSemiBold">
										{serie.title}
									</ThemedText>
								</ThemedView>
							))}

						{searchType === "actors" &&
							actorResults?.data.map((actor) => (
								<ThemedView
									key={actor.id}
									style={styles.resultItem}
								>
									<ThemedText type="defaultSemiBold">
										{actor.name}
									</ThemedText>
								</ThemedView>
							))}
					</ThemedView>
				)}
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		padding: 16,
		gap: 12,
	},
	searchbar: {
		elevation: 0,
	},
	segmented: {
		marginTop: 4,
	},
	content: {
		padding: 16,
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 48,
	},
	emptyText: {
		opacity: 0.7,
		marginTop: 8,
		textAlign: "center",
	},
	resultItem: {
		padding: 16,
		marginBottom: 8,
		borderRadius: 8,
		backgroundColor: "rgba(0,0,0,0.05)",
	},
});
