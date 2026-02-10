import { useQuery } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { Chip, Divider } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { userService } from "@/lib/api/user.service";
import { FavoriteItem, FavoriteType } from "@/types";

const TABS: { label: string; value: FavoriteType | "all" }[] = [
	{ label: "All", value: "all" },
	{ label: "Movies", value: "movies" },
	{ label: "Series", value: "series" },
	{ label: "Actors", value: "actors" },
	{ label: "Crew", value: "crew" },
	{ label: "Seasons", value: "seasons" },
	{ label: "Episodes", value: "episodes" },
];

const getItemDetails = (item: FavoriteItem, type: FavoriteType) => {
	switch (type) {
		case "movies":
			return {
				title: item.movie?.title ?? "Unknown",
				image: item.movie?.photoSrcProd ?? "",
				onPress: () => router.push(`/movies/${item.movie?.id}`),
			};
		case "series":
			return {
				title: item.serie?.title ?? "Unknown",
				image: item.serie?.photoSrcProd ?? "",
				onPress: () => router.push(`/series/${item.serie?.id}`),
			};
		case "actors":
			return {
				title: item.actor?.fullname ?? "Unknown",
				image: item.actor?.photoSrcProd ?? "",
				onPress: () => router.push(`/actors/${item.actor?.id}`),
			};
		case "crew":
			return {
				title: item.crew?.fullname ?? "Unknown",
				image: item.crew?.photoSrcProd ?? "",
				onPress: () => router.push(`/crew/${item.crew?.id}`),
			};
		case "seasons":
			return {
				title: item.season?.title ?? "Unknown",
				image: item.season?.photoSrcProd ?? "",
				onPress: () => router.push(`/seasons/${item.season?.id}`),
			};
		case "episodes":
			return {
				title: item.episode?.title ?? "Unknown",
				image: item.episode?.photoSrcProd ?? "",
				onPress: () =>
					router.push(`/seasons/episodes/${item.episode?.id}`),
			};
	}
};

export default function FavoritesScreen() {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];
	const [activeTab, setActiveTab] = useState<FavoriteType | "all">("all");
	const [page, setPage] = useState(1);

	const { data, isLoading } = useQuery({
		queryKey: ["favorites", activeTab, page],
		queryFn: () => {
			if (activeTab === "all") {
				return userService.getAllFavorites(page);
			}
			return userService.getFavorites(activeTab, page);
		},
	});

	const handleTabChange = (tab: FavoriteType | "all") => {
		setActiveTab(tab);
		setPage(1);
	};

	const handleLoadMore = () => {
		if (data && data.items.length < data.total) {
			setPage((prev) => prev + 1);
		}
	};

	const renderItem = ({ item }: { item: FavoriteItem }) => {
		const itemType: FavoriteType = item.movie
			? "movies"
			: item.serie
				? "series"
				: item.actor
					? "actors"
					: item.crew
						? "crew"
						: item.season
							? "seasons"
							: "episodes";
		const details = getItemDetails(item, itemType);

		return (
			<Pressable onPress={details.onPress} style={styles.itemCard}>
				<View
					style={[
						styles.itemCardInner,
						{ backgroundColor: colors.card },
					]}
				>
					{details.image ? (
						<Image
							source={{ uri: details.image }}
							style={styles.itemImage}
						/>
					) : (
						<View
							style={[
								styles.itemImagePlaceholder,
								{ backgroundColor: colors.border },
							]}
						>
							<ThemedText style={styles.placeholderText}>
								No Image
							</ThemedText>
						</View>
					)}
					<View style={styles.itemInfo}>
						<ThemedText
							type="defaultSemiBold"
							numberOfLines={2}
							style={styles.itemTitle}
						>
							{details.title}
						</ThemedText>
						<ThemedText
							style={[
								styles.itemType,
								{ color: colors.secondary },
							]}
						>
							{itemType.charAt(0).toUpperCase() +
								itemType.slice(1)}
						</ThemedText>
					</View>
				</View>
			</Pressable>
		);
	};

	return (
		<ThemedView style={styles.container}>
			<Stack.Screen
				options={{
					title: "My Favorites",
					headerStyle: { backgroundColor: colors.background },
					headerTintColor: colors.text,
					headerBackTitle: "Back",
				}}
			/>
			<View style={styles.tabsContainer}>
				<FlatList
					data={TABS}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.tabsList}
					keyExtractor={(item) => item.value}
					renderItem={({ item: tab }) => (
						<Chip
							selected={activeTab === tab.value}
							onPress={() => handleTabChange(tab.value)}
							style={[
								styles.chip,
								activeTab === tab.value && {
									backgroundColor: colors.primary,
								},
							]}
							textStyle={
								activeTab === tab.value
									? styles.chipTextActive
									: { color: colors.text }
							}
						>
							{tab.label}
						</Chip>
					)}
				/>
			</View>

			<Divider />

			{isLoading ? (
				<View style={styles.centered}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			) : !data || data.items.length === 0 ? (
				<View style={styles.centered}>
					<ThemedText style={styles.emptyText}>
						No favorites yet in {activeTab}
					</ThemedText>
				</View>
			) : (
				<FlatList
					data={data.items}
					keyExtractor={(item) => `${activeTab}-${item.id}`}
					renderItem={renderItem}
					contentContainerStyle={styles.list}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5}
					ItemSeparatorComponent={() => (
						<Divider style={styles.separator} />
					)}
					ListFooterComponent={
						data.items.length < data.total ? (
							<View style={styles.footerLoader}>
								<ActivityIndicator
									size="small"
									color={colors.primary}
								/>
							</View>
						) : null
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
	tabsContainer: {
		paddingVertical: 12,
	},
	tabsList: {
		paddingHorizontal: 16,
		gap: 8,
	},
	chip: {
		borderRadius: 20,
	},
	chipTextActive: {
		color: "#fff",
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
	},
	emptyText: {
		fontSize: 16,
		opacity: 0.6,
		textAlign: "center",
	},
	list: {
		padding: 16,
	},
	separator: {
		marginVertical: 4,
	},
	itemCard: {
		marginVertical: 4,
	},
	itemCardInner: {
		flexDirection: "row",
		borderRadius: 12,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
	},
	itemImage: {
		width: 90,
		height: 120,
	},
	itemImagePlaceholder: {
		width: 90,
		height: 120,
		justifyContent: "center",
		alignItems: "center",
	},
	placeholderText: {
		fontSize: 11,
		opacity: 0.5,
	},
	itemInfo: {
		flex: 1,
		padding: 12,
		justifyContent: "center",
	},
	itemTitle: {
		fontSize: 16,
		marginBottom: 4,
	},
	itemType: {
		fontSize: 13,
	},
	footerLoader: {
		paddingVertical: 16,
		alignItems: "center",
	},
});
