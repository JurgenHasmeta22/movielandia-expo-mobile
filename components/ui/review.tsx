import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/auth.store";
import { format } from "date-fns";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Chip, IconButton } from "react-native-paper";

interface ReviewUser {
	id: number;
	userName: string;
	avatar?: string;
}

interface ReviewProps {
	review: {
		id: number;
		content: string;
		createdAt: string;
		updatedAt: string;
		rating: number;
		user: ReviewUser;
		isUpvoted?: boolean;
		isDownvoted?: boolean;
		_count?: {
			upvotes: number;
			downvotes: number;
		};
	};
	onEdit?: () => void;
	onDelete?: () => void;
	onUpvote?: () => void;
	onDownvote?: () => void;
}

export function Review({
	review,
	onEdit,
	onDelete,
	onUpvote,
	onDownvote,
}: ReviewProps) {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];
	const user = useAuthStore((state) => state.user);

	const isOwnReview = user?.id === review.user.id;

	const getRatingColor = (rating: number) => {
		if (rating <= 2) return "#f44336";
		if (rating <= 4) return "#ff9800";
		if (rating <= 6) return "#2196f3";
		if (rating <= 8) return "#4caf50";
		return "#8bc34a";
	};

	const getRatingLabel = (rating: number) => {
		if (rating <= 2) return "Very Bad";
		if (rating <= 4) return "Bad";
		if (rating <= 6) return "Average";
		if (rating <= 8) return "Good";
		return "Very Good";
	};

	return (
		<Card style={[styles.card, { backgroundColor: colors.card }]}>
			<Card.Content>
				<View style={styles.header}>
					<View style={styles.userInfo}>
						<Avatar.Text
							size={40}
							label={review.user.userName
								.substring(0, 2)
								.toUpperCase()}
							style={{ backgroundColor: colors.primary }}
						/>
						<View style={styles.userDetails}>
							<ThemedText style={styles.userName}>
								{review.user.userName}
							</ThemedText>
							<ThemedText style={styles.date}>
								{format(
									new Date(review.createdAt),
									"MMM d, yyyy",
								)}
							</ThemedText>
						</View>
					</View>
					{isOwnReview && (
						<View style={styles.actions}>
							<IconButton
								icon="pencil"
								size={20}
								onPress={onEdit}
								iconColor={colors.text}
							/>
							<IconButton
								icon="delete"
								size={20}
								onPress={onDelete}
								iconColor="#f44336"
							/>
						</View>
					)}
				</View>

				<View style={styles.ratingContainer}>
					<Chip
						style={[
							styles.ratingChip,
							{ backgroundColor: getRatingColor(review.rating) },
						]}
						textStyle={styles.ratingChipText}
					>
						{review.rating}/10 - {getRatingLabel(review.rating)}
					</Chip>
				</View>

				<ThemedText style={styles.content}>{review.content}</ThemedText>

				{review._count && (
					<View style={styles.votesContainer}>
						<IconButton
							icon={
								review.isUpvoted
									? "thumb-up"
									: "thumb-up-outline"
							}
							size={20}
							onPress={onUpvote}
							iconColor={
								review.isUpvoted ? colors.primary : colors.text
							}
						/>
						<ThemedText style={styles.voteCount}>
							{review._count.upvotes}
						</ThemedText>
						<IconButton
							icon={
								review.isDownvoted
									? "thumb-down"
									: "thumb-down-outline"
							}
							size={20}
							onPress={onDownvote}
							iconColor={
								review.isDownvoted ? "#f44336" : colors.text
							}
						/>
						<ThemedText style={styles.voteCount}>
							{review._count.downvotes}
						</ThemedText>
					</View>
				)}
			</Card.Content>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		marginBottom: 16,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	userDetails: {
		gap: 2,
	},
	userName: {
		fontSize: 16,
		fontWeight: "600",
	},
	date: {
		fontSize: 12,
		opacity: 0.7,
	},
	actions: {
		flexDirection: "row",
		marginRight: -8,
	},
	ratingContainer: {
		marginBottom: 12,
	},
	ratingChip: {
		alignSelf: "flex-start",
	},
	ratingChipText: {
		color: "#fff",
		fontWeight: "600",
	},
	content: {
		lineHeight: 22,
		marginBottom: 12,
	},
	votesContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginLeft: -8,
	},
	voteCount: {
		fontSize: 14,
		fontWeight: "600",
		marginRight: 8,
	},
});
