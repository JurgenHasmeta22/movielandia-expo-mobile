import { MaterialIcons } from "@expo/vector-icons";
import { RelativePathString, router } from "expo-router";
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
}: MediaCardProps) {
	const [showOverlay, setShowOverlay] = useState(false);
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	const year = dateAired ? new Date(dateAired).getFullYear() : "N/A";
	const averageRating = ratings?.averageRating;

	const handlePress = () => {
		const route = type === "movie" ? `/movies/${id}` : `/series/${id}`;
		router.push(route as RelativePathString);
	};

	return (
		<Pressable
			onPress={handlePress}
			onLongPress={() => setShowOverlay(!showOverlay)}
			style={styles.container}
		>
			<Card style={styles.card}>
				<View style={styles.cardInner}>
					<View style={styles.imageContainer}>
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
										<Text
											variant="bodyMedium"
											style={styles.overlayTitle}
											numberOfLines={2}
										>
											{title} ({year})
										</Text>

										<View style={styles.ratings}>
											{ratingImdb && (
												<View style={styles.ratingItem}>
													<MaterialIcons
														name="movie"
														size={14}
														color="#F5C518"
													/>
													<Text
														variant="bodySmall"
														style={
															styles.ratingText
														}
													>
														{ratingImdb.toFixed(1)}
													</Text>
												</View>
											)}
											{averageRating &&
												averageRating > 0 && (
													<View
														style={
															styles.ratingItem
														}
													>
														<MaterialIcons
															name="star"
															size={14}
															color="#FFD700"
														/>
														<Text
															variant="bodySmall"
															style={
																styles.ratingText
															}
														>
															{averageRating.toFixed(
																1,
															)}
														</Text>
													</View>
												)}
										</View>

										{description && (
											<Text
												variant="bodySmall"
												style={styles.description}
												numberOfLines={3}
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
		height: 260,
	},
	image: {
		width: "100%",
		height: "100%",
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
		lineHeight: 16,
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
