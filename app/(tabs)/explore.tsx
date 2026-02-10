import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Searchbar,
    SegmentedButtons,
} from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MediaCard } from "@/components/ui/media-card";
import { actorService } from "@/lib/api/actor.service";
import { crewService } from "@/lib/api/crew.service";
import { movieService } from "@/lib/api/movie.service";
import { serieService } from "@/lib/api/serie.service";

export default function SearchScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchType, setSearchType] = useState("movies");

	const { data: movieResults, isLoading: moviesLoading } = useQuery({
		queryKey: ["movies", "search", searchQuery],
		queryFn: () => movieService.search(searchQuery),
		enabled: searchType === "movies" && searchQuery.length > 2,
	});

	const { data: serieResults, isLoading: seriesLoading } = useQuery({
		queryKey: ["series", "search", searchQuery],
		queryFn: () => serieService.search(searchQuery),
		enabled: searchType === "series" && searchQuery.length > 2,
	});

	const { data: actorResults, isLoading: actorsLoading } = useQuery({
		queryKey: ["actors", "search", searchQuery],
		queryFn: () => actorService.search(searchQuery),
		enabled: searchType === "actors" && searchQuery.length > 2,
	});

	const { data: crewResults, isLoading: crewLoading } = useQuery({
		queryKey: ["crew", "search", searchQuery],
		queryFn: () => crewService.search(searchQuery),
		enabled: searchType === "crew" && searchQuery.length > 2,
	});

	const isLoading =
		moviesLoading || seriesLoading || actorsLoading || crewLoading;

	return (
		<ThemedView style={styles.container}>
			<View style={styles.header}>
				<Searchbar
					placeholder="Search movies, series, actors, crew..."
					onChangeText={setSearchQuery}
					value={searchQuery}
					style={styles.searchbar}
					iconColor="#e50914"
				/>

				<SegmentedButtons
					value={searchType}
					onValueChange={setSearchType}
					buttons={[
						{ value: "movies", label: "Movies" },
						{ value: "series", label: "Series" },
						{ value: "actors", label: "Actors" },
						{ value: "crew", label: "Crew" },
					]}
					style={styles.segmented}
					density="small"
				/>
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				{!searchQuery || searchQuery.length < 3 ? (
					<ThemedView style={styles.emptyState}>
						<ThemedText type="subtitle" style={styles.emptyTitle}>
							🔍 Start searching...
						</ThemedText>
						<ThemedText style={styles.emptyText}>
							Enter at least 3 characters to find movies, series,
							actors, or crew members
						</ThemedText>
					</ThemedView>
				) : isLoading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#e50914" />
						<ThemedText style={styles.loadingText}>
							Searching...
						</ThemedText>
					</View>
				) : (
					<View>
						{searchType === "movies" && (
							<View>
								{(movieResults?.data || []).length === 0 ? (
									<ThemedText style={styles.noResults}>
										No movies found
									</ThemedText>
								) : (
									<View style={styles.grid}>
										{movieResults?.data &&
											Array.isArray(movieResults.data) &&
											movieResults.data.map((movie) => (
												<MediaCard
													key={movie.id}
													id={movie.id}
													title={movie.title}
													photoSrcProd={
														movie.photoSrcProd
													}
													dateAired={movie.dateAired}
													ratingImdb={
														movie.ratingImdb
													}
													ratings={movie.ratings}
													description={
														movie.description
													}
													type="movie"
													isBookmarked={
														movie.isBookmarked
													}
												/>
											))}
									</View>
								)}
							</View>
						)}

						{searchType === "series" && (
							<View>
								{(serieResults?.data || []).length === 0 ? (
									<ThemedText style={styles.noResults}>
										No series found
									</ThemedText>
								) : (
									<View style={styles.grid}>
										{serieResults?.data &&
											Array.isArray(serieResults.data) &&
											serieResults.data.map((serie) => (
												<MediaCard
													key={serie.id}
													id={serie.id}
													title={serie.title}
													photoSrcProd={
														serie.photoSrcProd
													}
													dateAired={serie.dateAired}
													ratingImdb={
														serie.ratingImdb
													}
													ratings={serie.ratings}
													description={
														serie.description
													}
													type="series"
													isBookmarked={
														serie.isBookmarked
													}
												/>
											))}
									</View>
								)}
							</View>
						)}

						{searchType === "actors" && (
							<View>
								{(actorResults?.data || []).length === 0 ? (
									<ThemedText style={styles.noResults}>
										No actors found
									</ThemedText>
								) : (
									<View style={styles.listContainer}>
										{actorResults?.data &&
											Array.isArray(actorResults.data) &&
											actorResults.data.map((actor) => (
												<View
													key={actor.id}
													style={styles.personCard}
												>
													<ThemedText type="defaultSemiBold">
														{actor.name}
													</ThemedText>
													{actor.birthday && (
														<ThemedText
															style={
																styles.personMeta
															}
														>
															Born:{" "}
															{new Date(
																actor.birthday,
															).getFullYear()}
														</ThemedText>
													)}
												</View>
											))}
									</View>
								)}
							</View>
						)}

						{searchType === "crew" && (
							<View>
								{(crewResults?.data || []).length === 0 ? (
									<ThemedText style={styles.noResults}>
										No crew members found
									</ThemedText>
								) : (
									<View style={styles.listContainer}>
										{crewResults?.data &&
											Array.isArray(crewResults.data) &&
											crewResults.data.map((crew) => (
												<View
													key={crew.id}
													style={styles.personCard}
												>
													<ThemedText type="defaultSemiBold">
														{crew.name}
													</ThemedText>
													{crew.birthday && (
														<ThemedText
															style={
																styles.personMeta
															}
														>
															Born:{" "}
															{new Date(
																crew.birthday,
															).getFullYear()}
														</ThemedText>
													)}
												</View>
											))}
									</View>
								)}
							</View>
						)}
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
		flexGrow: 1,
		paddingBottom: 16,
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 48,
		paddingHorizontal: 32,
		gap: 8,
	},
	emptyTitle: {
		fontSize: 18,
		marginBottom: 8,
	},
	emptyText: {
		opacity: 0.7,
		marginTop: 8,
		textAlign: "center",
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 32,
		gap: 16,
	},
	loadingText: {
		opacity: 0.7,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 8,
		gap: 12,
	},
	listContainer: {
		padding: 16,
		gap: 12,
	},
	personCard: {
		padding: 16,
		marginBottom: 8,
		borderRadius: 8,
		backgroundColor: "rgba(0,0,0,0.05)",
		gap: 4,
	},
	personMeta: {
		opacity: 0.7,
		fontSize: 14,
	},
	noResults: {
		textAlign: "center",
		padding: 32,
		opacity: 0.7,
	},
});
