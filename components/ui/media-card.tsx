import { MaterialIcons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useState } from "react";
import {
	Image,
	Pressable,
	StyleSheet,
	View,
	useColorScheme,
} from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

interface RatingInfo {
	averageRating: number;
	totalReviews: number;
}

interface MediaCardProps {
	id: number;
	title: string;
	photoSrcProd?: string | null;
	dateAired?: string | null;
	ratingImdb?: number | null;
	ratings?: RatingInfo | null;
	description?: string | null;
	type: "movie" | "series";
	isBookmarked?: boolean;
	onBookmark?: () => void;
	variant?: "default" | "compact";
}

export function MediaCard({
	id,
	title,
	photoSrcProd,
	dateAired,
	ratingImdb,
	ratings,
	description,
	type,
	isBookmarked = false,
	onBookmark,
	variant = "default",
}: MediaCardProps) {
	const [showOverlay, setShowOverlay] = useState(false);
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	const year = dateAired ? new Date(dateAired).getFullYear() : "N/A";
	const averageRating = ratings?.averageRating;

	const handlePress = () => {
		const route = type === "movie" ? `/movies/${id}` : `/series/${id}`;
		router.push(route as Href);
	};

	return (
		<Pressable
			onPress={handlePress}
			onLongPress={() => setShowOverlay(!showOverlay)}
			style={[
				styles.container,
				variant === "compact" && styles.containerCompact,
			]}
		>
			<Card style={styles.card}>
				<View style={styles.cardInner}>
					<View
						style={[
							styles.imageContainer,
							variant === "compact" &&
								styles.imageContainerCompact,
						]}
					>
						<Image
							source={{
								uri:
									photoSrcProd ||
									"https://via.placeholder.com/160x240",
							}}
							style={styles.image}
							resizeMode="cover"
						/>

						{showOverlay && (
							<View
								style={[
									styles.overlay,
									isDark
										? styles.overlayDark
										: styles.overlayLight,
								]}
							>
								<View style={styles.overlayContent}>
									<View style={styles.overlayTop}>
										{description && (
											<Text
												variant="bodySmall"
												style={styles.description}
												numberOfLines={5}
											>
												{description}
											</Text>
										)}
									</View>

									{onBookmark && (
										<View style={styles.overlayBottom}>
											<IconButton
												icon={
													isBookmarked
														? "bookmark"
														: "bookmark-outline"
												}
												iconColor={
													isBookmarked
														? "#f44336"
														: "#fff"
												}
												size={20}
												onPress={(e) => {
													e.stopPropagation();
													onBookmark();
												}}
												style={styles.bookmarkButton}
											/>
											<Text
												variant="bodySmall"
												style={styles.bookmarkText}
											>
												{isBookmarked
													? "Bookmarked"
													: "Bookmark"}
											</Text>
										</View>
									)}
								</View>
							</View>
						)}
					</View>

					<Card.Content style={styles.cardContent}>
						<Text
							variant="bodyMedium"
							style={styles.cardTitle}
							numberOfLines={2}
						>
							{title}
						</Text>
						<View style={styles.metaInfo}>
							{year !== "N/A" && (
								<Text
									variant="bodySmall"
									style={styles.metaText}
								>
									{year}
								</Text>
							)}
							{(ratingImdb ||
								(averageRating && averageRating > 0)) && (
								<View style={styles.ratingRow}>
									{ratingImdb && (
										<>
											<MaterialIcons
												name="movie"
												size={12}
												color="#F5C518"
											/>
											<Text
												variant="bodySmall"
												style={styles.ratingValue}
											>
												{ratingImdb.toFixed(1)}
											</Text>
										</>
									)}
									{averageRating && averageRating > 0 && (
										<>
											<MaterialIcons
												name="star"
												size={12}
												color="#FFD700"
											/>
											<Text
												variant="bodySmall"
												style={styles.ratingValue}
											>
												{averageRating.toFixed(1)}
											</Text>
										</>
									)}
								</View>
							)}
						</View>
					</Card.Content>
				</View>
			</Card>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		marginBottom: 12,
	},
	containerCompact: {
		marginBottom: 8,
	},
	card: {
		borderRadius: 12,
		elevation: 4,
	},
	cardInner: {
		overflow: "hidden",
		borderRadius: 12,
	},
	imageContainer: {
		position: "relative",
		width: "100%",
		height: 240,
	},
	imageContainerCompact: {
		height: 160,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	cardContent: {
		paddingVertical: 12,
		paddingHorizontal: 8,
		minHeight: 70,
	},
	cardTitle: {
		fontWeight: "600",
		marginBottom: 6,
		lineHeight: 18,
	},
	metaInfo: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 8,
	},
	metaText: {
		opacity: 0.7,
		fontSize: 12,
	},
	ratingRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	ratingValue: {
		fontSize: 12,
		marginRight: 6,
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		padding: 12,
	},
	overlayDark: {
		backgroundColor: "rgba(0, 0, 0, 0.85)",
	},
	overlayLight: {
		backgroundColor: "rgba(0, 0, 0, 0.75)",
	},
	overlayContent: {
		flex: 1,
		justifyContent: "space-between",
	},
	overlayTop: {
		gap: 8,
	},
	overlayTitle: {
		color: "#fff",
		fontWeight: "600",
		lineHeight: 20,
	},
	ratings: {
		flexDirection: "row",
		gap: 12,
	},
	ratingItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	ratingText: {
		color: "#fff",
		fontSize: 12,
	},
	description: {
		color: "#fff",
		opacity: 0.9,
		lineHeight: 18,
	},
	overlayBottom: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	bookmarkButton: {
		margin: 0,
		borderWidth: 1,
		borderColor: "#fff",
	},
	bookmarkText: {
		color: "#fff",
		fontSize: 12,
	},
});
