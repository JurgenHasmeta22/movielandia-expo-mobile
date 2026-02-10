import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
						<ThemedText>Loading...</ThemedText>
					) : (
						<View style={styles.grid}>
							{latestMovies?.slice(0, 6).map((movie: Movie) => (
								<Button
									key={movie.id}
									mode="outlined"
									onPress={() =>
										router.push(`/movies/${movie.id}`)
									}
									style={styles.gridItem}
								>
									{movie.title}
								</Button>
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
						<ThemedText>Loading...</ThemedText>
					) : (
						<View style={styles.grid}>
							{latestSeries?.slice(0, 6).map((serie: Serie) => (
								<Button
									key={serie.id}
									mode="outlined"
									onPress={() =>
										router.push(`/series/${serie.id}`)
									}
									style={styles.gridItem}
								>
									{serie.title}
								</Button>
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
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	gridItem: {
		width: "48%",
	},
});
