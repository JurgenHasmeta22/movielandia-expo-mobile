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
import { ReviewItemType, UserReviewItem } from "@/types";

const TABS: { label: string; value: ReviewItemType | "all" }[] = [
	{ label: "All", value: "all" },
	{ label: "Movies", value: "movie" },
	{ label: "Series", value: "serie" },
	{ label: "Seasons", value: "season" },
	{ label: "Episodes", value: "episode" },
	{ label: "Actors", value: "actor" },
	{ label: "Crew", value: "crew" },
];

const getDetailRoute = (itemType: ReviewItemType, itemId: number): string => {
	switch (itemType) {
		case "movie":
			return `/movies/${itemId}`;
		case "serie":
			return `/series/${itemId}`;
		case "actor":
			return `/actors/${itemId}`;
		case "crew":
			return `/crew/${itemId}`;
		case "season":
			return `/seasons/${itemId}`;
		case "episode":
			return `/seasons/episodes/${itemId}`;
	}
};

const getTypeLabel = (type: ReviewItemType): string => {
	const labels: Record<ReviewItemType, string> = {
		movie: "Movie",
		serie: "Series",
		season: "Season",
		episode: "Episode",
		actor: "Actor",
		crew: "Crew",
	};
	return labels[type];
};

const formatDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const renderStars = (rating: number): string => {
	if (!rating || isNaN(rating) || rating < 0 || rating > 5) {
		return "☆☆☆☆☆";
	}
	const fullStars = Math.floor(rating);
	const emptyStars = 5 - fullStars;
	return "★".repeat(fullStars) + "☆".repeat(emptyStars);
};

export default function ReviewsScreen() {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];
	const [activeTab, setActiveTab] = useState<ReviewItemType | "all">("all");
	const [page, setPage] = useState(1);

	const { data, isLoading } = useQuery({
		queryKey: ["myReviews", activeTab, page],
		queryFn: () =>
			userService.getMyReviews(
				page,
				activeTab === "all" ? undefined : activeTab,
			),
	});

	const handleTabChange = (tab: ReviewItemType | "all") => {
		setActiveTab(tab);
		setPage(1);
	};

	const handleLoadMore = () => {
		if (data && data.items.length < data.total) {
			setPage((prev) => prev + 1);
		}
	};

	const renderItem = ({ item }: { item: UserReviewItem }) => {
		const route = getDetailRoute(item.itemType, item.itemId);

		return (
			<Pressable
				onPress={() => router.push(route as any)}
				style={styles.reviewCard}
			>
				<View
					style={[
						styles.reviewCardInner,
						{ backgroundColor: colors.card },
					]}
				>
					<View style={styles.reviewTop}>
						{item.itemImage ? (
							<Image
								source={{ uri: item.itemImage }}
								style={styles.reviewImage}
							/>
						) : (
							<View
								style={[
									styles.reviewImagePlaceholder,
									{ backgroundColor: colors.border },
								]}
							>
								<ThemedText style={styles.placeholderText}>
									No Image
								</ThemedText>
							</View>
						)}
						<View style={styles.reviewMeta}>
							<ThemedText
								type="defaultSemiBold"
								numberOfLines={2}
								style={styles.reviewTitle}
							>
								{item.itemTitle}
							</ThemedText>
							<View style={styles.badgeRow}>
								<View
									style={[
										styles.typeBadge,
										{ backgroundColor: colors.primary },
									]}
								>
									<ThemedText style={styles.typeBadgeText}>
										{getTypeLabel(item.itemType)}
									</ThemedText>
								</View>
								<ThemedText
									style={[
										styles.dateText,
										{ color: colors.secondary },
									]}
								>
									{formatDate(item.createdAt)}
								</ThemedText>
							</View>
							<ThemedText
								style={[
									styles.starsText,
									{ color: colors.accent },
								]}
							>
								{renderStars(item.rating)} {item.rating}/5
							</ThemedText>
						</View>
					</View>
					{item.content && (
						<ThemedText
							numberOfLines={3}
							style={styles.reviewContent}
						>
							{item.content}
						</ThemedText>
					)}
				</View>
			</Pressable>
		);
	};

	return (
		<ThemedView style={styles.container}>
			<Stack.Screen
				options={{
					title: "My Reviews",
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
						No reviews yet
						{activeTab !== "all"
							? ` for ${getTypeLabel(activeTab as ReviewItemType).toLowerCase()}`
							: ""}
					</ThemedText>
				</View>
			) : (
				<FlatList
					data={data.items}
					keyExtractor={(item) => `${item.itemType}-${item.id}`}
					renderItem={renderItem}
					contentContainerStyle={styles.list}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5}
					ItemSeparatorComponent={() => (
						<View style={styles.separator} />
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
		height: 12,
	},
	reviewCard: {
		marginVertical: 2,
	},
	reviewCardInner: {
		borderRadius: 12,
		overflow: "hidden",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		padding: 12,
	},
	reviewTop: {
		flexDirection: "row",
	},
	reviewImage: {
		width: 70,
		height: 100,
		borderRadius: 8,
	},
	reviewImagePlaceholder: {
		width: 70,
		height: 100,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	placeholderText: {
		fontSize: 10,
		opacity: 0.5,
	},
	reviewMeta: {
		flex: 1,
		marginLeft: 12,
		justifyContent: "center",
	},
	reviewTitle: {
		fontSize: 16,
		marginBottom: 6,
	},
	badgeRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 4,
	},
	typeBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 12,
	},
	typeBadgeText: {
		color: "#fff",
		fontSize: 11,
		fontWeight: "600",
	},
	dateText: {
		fontSize: 12,
	},
	starsText: {
		fontSize: 14,
		marginTop: 2,
	},
	reviewContent: {
		marginTop: 10,
		fontSize: 14,
		lineHeight: 20,
		opacity: 0.85,
	},
	footerLoader: {
		paddingVertical: 16,
		alignItems: "center",
	},
});
