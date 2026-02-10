import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
	ImageBackground,
	RefreshControl,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { ActivityIndicator, Button, Divider } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Footer } from "@/components/ui/footer";
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
				<ImageBackground
					source={require("@/assets/images/background.png")}
					style={styles.heroBackground}
					resizeMode="cover"
				>
					<View style={styles.heroOverlay}>
						<View style={styles.heroSection}>
							<ThemedText style={styles.heroMainTitle}>
								Dive into MovieLandia24
							</ThemedText>
							<ThemedText style={styles.heroTitle}>
								Your Gateway to the World of Cinema!
							</ThemedText>
							<ThemedText style={styles.heroSubtitle}>
								Explore the latest blockbusters and timeless
								classics in our curated collection of movies and
								series. Discover, rate, and share your favorite
								cinematic experiences.
							</ThemedText>
							<View style={styles.heroButtons}>
								<Button
									mode="contained"
									onPress={() =>
										router.push("/(tabs)/movies")
									}
									style={styles.primaryButton}
									icon="play"
									buttonColor="#ff5722"
								>
									Explore Movies
								</Button>
								<Button
									mode="outlined"
									onPress={() =>
										router.push("/(tabs)/series")
									}
									style={styles.outlineButton}
									textColor="#fff"
									icon="television"
								>
									Browse Series
								</Button>
							</View>
							<View style={styles.heroFeature}>
								<MaterialCommunityIcons
									name="star"
									size={16}
									color="rgba(255,255,255,0.7)"
								/>
								<ThemedText style={styles.heroFeatureText}>
									Featuring thousands of titles across all
									genres
								</ThemedText>
							</View>
						</View>
					</View>
				</ImageBackground>

				<Divider style={styles.divider} />

				<ThemedView style={styles.section}>
					<ThemedView style={styles.sectionHeader}>
						<View>
							<ThemedText
								type="subtitle"
								style={styles.sectionTitle}
							>
								Latest Movies
							</ThemedText>
							<ThemedText style={styles.sectionSubtitle}>
								Check out the newest releases
							</ThemedText>
						</View>
						<Button
							mode="text"
							onPress={() => router.push("/(tabs)/movies")}
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
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalScroll}
						>
							{latestMovies?.slice(0, 6).map((movie: Movie) => (
								<View
									key={movie.id}
									style={styles.horizontalCard}
								>
									<MediaCard
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
								</View>
							))}
						</ScrollView>
					)}
				</ThemedView>

				<Divider style={styles.divider} />

				<ThemedView style={styles.section}>
					<ThemedView style={styles.sectionHeader}>
						<View>
							<ThemedText
								type="subtitle"
								style={styles.sectionTitle}
							>
								Latest TV Series
							</ThemedText>
							<ThemedText style={styles.sectionSubtitle}>
								Binge-worthy shows just for you
							</ThemedText>
						</View>
						<Button
							mode="text"
							onPress={() => router.push("/(tabs)/series")}
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
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.horizontalScroll}
						>
							{latestSeries?.slice(0, 6).map((serie: Serie) => (
								<View
									key={serie.id}
									style={styles.horizontalCard}
								>
									<MediaCard
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
								</View>
							))}
						</ScrollView>
					)}
				</ThemedView>

				<Footer />
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 0,
	},
	heroBackground: {
		width: "100%",
		minHeight: 400,
	},
	heroOverlay: {
		backgroundColor: "rgba(0,0,0,0.7)",
		width: "100%",
		minHeight: 400,
		justifyContent: "center",
	},
	heroSection: {
		paddingVertical: 48,
		paddingHorizontal: 24,
	},
	heroMainTitle: {
		fontSize: 32,
		fontWeight: "900",
		color: "#fff",
		marginBottom: 12,
		letterSpacing: -0.5,
		lineHeight: 40,
		textShadowColor: "rgba(0,0,0,0.3)",
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 8,
	},
	heroTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "rgba(255,255,255,0.95)",
		marginBottom: 16,
		textShadowColor: "rgba(0,0,0,0.2)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 4,
	},
	heroSubtitle: {
		fontSize: 14,
		lineHeight: 22,
		color: "rgba(255,255,255,0.85)",
		marginBottom: 24,
		textShadowColor: "rgba(0,0,0,0.2)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
	},
	heroButtons: {
		gap: 12,
		marginBottom: 20,
	},
	primaryButton: {
		borderRadius: 12,
		elevation: 4,
	},
	outlineButton: {
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "rgba(255,255,255,0.7)",
		backgroundColor: "rgba(255,255,255,0.05)",
	},
	heroFeature: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		opacity: 0.8,
	},
	heroFeatureText: {
		fontSize: 12,
		color: "rgba(255,255,255,0.7)",
	},
	divider: {
		marginVertical: 16,
		opacity: 0.2,
	},
	section: {
		paddingHorizontal: 16,
		marginBottom: 8,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "600",
	},
	sectionSubtitle: {
		fontSize: 13,
		opacity: 0.6,
		marginTop: 4,
	},
	loadingContainer: {
		paddingVertical: 20,
		alignItems: "center",
	},
	horizontalScroll: {
		paddingRight: 16,
	},
	horizontalCard: {
		width: 180,
		marginRight: 16,
	},
});
