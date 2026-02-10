import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { genreService } from "@/lib/api/genre.service";
import { serieService } from "@/lib/api/serie.service";

export default function SeriesScreen() {
	const [page, setPage] = useState(1);
	const [selectedGenre, setSelectedGenre] = useState<number | undefined>();
	const [refreshing, setRefreshing] = useState(false);

	const {
		data: series,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["series", page, selectedGenre],
		queryFn: () =>
			serieService.getAll({ page, perPage: 20, genreId: selectedGenre }),
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
				{genres?.map((genre) => (
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

			<ScrollView
				contentContainerStyle={styles.content}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			>
				{isLoading ? (
					<ThemedText>Loading...</ThemedText>
				) : (
					<View style={styles.grid}>
						{series?.data.map((serie) => (
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

				{series && series.meta.totalPages > 1 && (
					<View style={styles.pagination}>
						<Button
							mode="contained"
							onPress={() => setPage(page - 1)}
							disabled={!series.meta.hasPreviousPage}
						>
							Previous
						</Button>
						<ThemedText>
							Page {page} of {series.meta.totalPages}
						</ThemedText>
						<Button
							mode="contained"
							onPress={() => setPage(page + 1)}
							disabled={!series.meta.hasNextPage}
						>
							Next
						</Button>
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
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	gridItem: {
		width: "48%",
	},
	pagination: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 24,
		gap: 16,
	},
});
