import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import {
	ActivityIndicator,
	Searchbar,
	SegmentedButtons,
} from "react-native-paper";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MediaCard } from "@/components/ui/media-card";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { actorService } from "@/lib/api/actor.service";
import { crewService } from "@/lib/api/crew.service";
import { episodeService } from "@/lib/api/episode.service";
import { movieService } from "@/lib/api/movie.service";
import { seasonService } from "@/lib/api/season.service";
import { serieService } from "@/lib/api/serie.service";

export default function SearchScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [submittedQuery, setSubmittedQuery] = useState("");
	const [searchType, setSearchType] = useState("movies");
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];

	const handleSearch = () => {
		if (searchQuery.trim().length > 0) {
			Keyboard.dismiss();
			setSubmittedQuery(searchQuery.trim());
		}
	};

	const { data: movieResults, isLoading: moviesLoading } = useQuery({
		queryKey: ["movies", "search", submittedQuery],
		queryFn: () => movieService.search(submittedQuery),
		enabled: searchType === "movies" && submittedQuery.length > 0,
	});

	const { data: serieResults, isLoading: seriesLoading } = useQuery({
		queryKey: ["series", "search", submittedQuery],
		queryFn: () => serieService.search(submittedQuery),
		enabled: searchType === "series" && submittedQuery.length > 0,
	});

	const { data: actorResults, isLoading: actorsLoading } = useQuery({
		queryKey: ["actors", "search", submittedQuery],
		queryFn: () => actorService.search(submittedQuery),
		enabled: searchType === "actors" && submittedQuery.length > 0,
	});

	const { data: crewResults, isLoading: crewLoading } = useQuery({
		queryKey: ["crew", "search", submittedQuery],
		queryFn: () => crewService.search(submittedQuery),
		enabled: searchType === "crew" && submittedQuery.length > 0,
	});

	const { data: seasonResults, isLoading: seasonsLoading } = useQuery({
		queryKey: ["seasons", "search", submittedQuery],
		queryFn: () => seasonService.search(submittedQuery),
		enabled: searchType === "seasons" && submittedQuery.length > 0,
	});

	const { data: episodeResults, isLoading: episodesLoading } = useQuery({
		queryKey: ["episodes", "search", submittedQuery],
		queryFn: () => episodeService.search(submittedQuery),
		enabled: searchType === "episodes" && submittedQuery.length > 0,
	});

	const isLoading =
		moviesLoading ||
		seriesLoading ||
		actorsLoading ||
		crewLoading ||
		seasonsLoading ||
		episodesLoading;

	return (
		<ThemedView style={styles.container}>
			<View style={styles.header}>
				<Searchbar
					placeholder="Search by title, name..."
					onChangeText={setSearchQuery}
					onSubmitEditing={handleSearch}
					value={searchQuery}
					style={[styles.searchbar, { backgroundColor: colors.card }]}
					inputStyle={{ color: colors.text }}
					placeholderTextColor={colors.text + "80"}
					icon="magnify"
					iconColor={colors.text}
				/>

				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<SegmentedButtons
						value={searchType}
						onValueChange={(value) => {
							setSearchType(value);
							if (submittedQuery.length > 0) {
								setSubmittedQuery(submittedQuery);
							}
						}}
						buttons={[
							{ value: "movies", label: "Movies" },
							{ value: "series", label: "Series" },
							{ value: "seasons", label: "Seasons" },
							{ value: "episodes", label: "Episodes" },
							{ value: "actors", label: "Actors" },
							{ value: "crew", label: "Crew" },
						]}
						style={styles.segmented}
						density="small"
					/>
				</ScrollView>
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				{!submittedQuery ? (
					<ThemedView style={styles.emptyState}>
						<MaterialCommunityIcons
							name="magnify"
							size={48}
							color={colors.text + "40"}
						/>
						<ThemedText type="subtitle" style={styles.emptyTitle}>
							Search MovieLandia
						</ThemedText>
						<ThemedText style={styles.emptyText}>
							Find your favorite movies, series, actors, or crew
							members
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
								{(movieResults?.movies || []).length === 0 ? (
									<ThemedText style={styles.noResults}>
										No movies found
									</ThemedText>
								) : (
									<View style={styles.grid}>
										{movieResults?.movies?.map((movie) => (
											<MediaCard
												key={movie.id}
												id={movie.id}
												title={movie.title}
												photoSrcProd={
													movie.photoSrcProd
												}
												dateAired={movie.dateAired}
												ratingImdb={movie.ratingImdb}
												ratings={movie.ratings}
												description={movie.description}
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
								{(serieResults?.series || []).length === 0 ? (
									<ThemedText style={styles.noResults}>
										No series found
									</ThemedText>
								) : (
									<View style={styles.grid}>
										{serieResults?.series?.map((serie) => (
											<MediaCard
												key={serie.id}
												id={serie.id}
												title={serie.title}
												photoSrcProd={
													serie.photoSrcProd
												}
												dateAired={serie.dateAired}
												ratingImdb={serie.ratingImdb}
												ratings={serie.ratings}
												description={serie.description}
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

						{searchType === "seasons" && (
							<View>
								{(seasonResults?.seasons || []).length === 0 ? (
									<ThemedText style={styles.noResults}>
										No seasons found
									</ThemedText>
								) : (
									<View style={styles.grid}>
										{seasonResults?.seasons?.map(
											(season) => (
												<MediaCard
													key={season.id}
													id={season.id}
													title={season.title}
													photoSrcProd={
														season.photoSrcProd
													}
													dateAired={season.dateAired}
													ratingImdb={
														season.ratingImdb
													}
													ratings={season.ratings}
													description={
														season.description
													}
													type="series"
													isBookmarked={
														season.isBookmarked
													}
												/>
											),
										)}
									</View>
								)}
							</View>
						)}

						{searchType === "episodes" && (
							<View>
								{(episodeResults?.episodes || []).length ===
								0 ? (
									<ThemedText style={styles.noResults}>
										No episodes found
									</ThemedText>
								) : (
									<View style={styles.grid}>
										{episodeResults?.episodes?.map(
											(episode) => (
												<MediaCard
													key={episode.id}
													id={episode.id}
													title={episode.title}
													photoSrcProd={
														episode.photoSrcProd
													}
													dateAired={
														episode.dateAired
													}
													ratingImdb={
														episode.ratingImdb
													}
													ratings={episode.ratings}
													description={
														episode.description
													}
													type="series"
													isBookmarked={
														episode.isBookmarked
													}
												/>
											),
										)}
									</View>
								)}
							</View>
						)}

						{searchType === "actors" && (
							<View>
								{(actorResults?.actors || []).length === 0 ? (
									<ThemedText style={styles.noResults}>
										No actors found
									</ThemedText>
								) : (
									<View style={styles.grid}>
										{actorResults?.actors?.map((actor) => (
											<MediaCard
												key={actor.id}
												id={actor.id}
												title={actor.fullname}
												photoSrcProd={
													actor.photoSrcProd
												}
												ratingImdb={undefined}
												ratings={actor.ratings}
												description={actor.description}
												type="movie"
												isBookmarked={
													actor.isBookmarked
												}
											/>
										))}
									</View>
								)}
							</View>
						)}

						{searchType === "crew" && (
							<View>
								{(crewResults?.crew || []).length === 0 ? (
									<ThemedText style={styles.noResults}>
										No crew members found
									</ThemedText>
								) : (
									<View style={styles.grid}>
										{crewResults?.crew?.map((member) => (
											<MediaCard
												key={member.id}
												id={member.id}
												title={member.fullname}
												photoSrcProd={
													member.photoSrcProd
												}
												ratingImdb={undefined}
												ratings={member.ratings}
												description={member.description}
												type="movie"
												isBookmarked={
													member.isBookmarked
												}
											/>
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
	noResults: {
		textAlign: "center",
		padding: 32,
		opacity: 0.7,
	},
});
