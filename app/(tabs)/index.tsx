import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MediaCard } from "@/components/ui/media-card";
import { movieService } from "@/lib/api/movie.service";
import { serieService } from "@/lib/api/serie.service";
import { Movie, Serie } from "@/types";

export default function HomeScreen() {
	const [refreshing, setRefreshing] = useState(false);

	const {
		data: latestMovies,
		isLoading: moviesLoading,
		refetch: refetchMovies,
	} = useQuery({
		queryKey: ["movies", "latest"],
		queryFn: () => movieService.getLatest(),
	});

	const {
		data: latestSeries,
		isLoading: seriesLoading,
		refetch: refetchSeries,
	} = useQuery({
		queryKey: ["series", "latest"],
		queryFn: () => serieService.getLatest(),
	});

	const onRefresh = async () => {
		setRefreshing(true);
		await Promise.all([refetchMovies(), refetchSeries()]);
		setRefreshing(false);
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			>
				<ThemedView style={styles.section}>
					<ThemedView style={styles.sectionHeader}>
						<ThemedText type="title" style={styles.sectionTitle}>
							Welcome to MovieLandia
						</ThemedText>
					</ThemedView>
					<ThemedText style={styles.subtitle}>
						Discover the latest movies and TV series
					</ThemedText>
				</ThemedView>

				<ThemedView style={styles.section}>
					<ThemedView style={styles.sectionHeader}>
						<ThemedText type="subtitle">Latest Movies</ThemedText>
						<Button
							mode="text"
							onPress={() => router.push("/movies")}
							compact
						>
							See All
						</Button>
					</ThemedView>
					{moviesLoading ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="small" />
						</View>
					) : (
						<View style={styles.grid}>
							{latestMovies?.slice(0, 6).map((movie: Movie) => (
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
				</ThemedView>

				<ThemedView style={styles.section}>
					<ThemedView style={styles.sectionHeader}>
						<ThemedText type="subtitle">
							Latest TV Series
						</ThemedText>
						<Button
							mode="text"
							onPress={() => router.push("/series")}
							compact
						>
							See All
						</Button>
					</ThemedView>
					{seriesLoading ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="small" />
						</View>
					) : (
						<View style={styles.grid}>
							{latestSeries?.slice(0, 6).map((serie: Serie) => (
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
				</ThemedView>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
	},
	section: {
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 24,
	},
	subtitle: {
		opacity: 0.7,
		marginTop: 4,
	},
	loadingContainer: {
		paddingVertical: 20,
		alignItems: "center",
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
});
