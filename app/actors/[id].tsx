import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { Card, IconButton } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { actorService } from "@/lib/api/actor.service";

export default function ActorDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];

	const { data: actor, isLoading } = useQuery({
		queryKey: ["actor", id],
		queryFn: () => actorService.getOne(Number(id)),
		enabled: !!id,
	});

	if (isLoading) {
		return (
			<ThemedView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ThemedText>Loading...</ThemedText>
				</View>
			</ThemedView>
		);
	}

	if (!actor) {
		return (
			<ThemedView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ThemedText>Actor not found</ThemedText>
				</View>
			</ThemedView>
		);
	}

	const handleWriteReview = () => {
		Alert.alert("Write Review", "Review functionality coming soon!", [
			{
				text: "OK",
				onPress: () => console.log("Review dialog"),
			},
		]);
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView
				contentContainerStyle={[
					styles.content,
					{ backgroundColor: colors.background },
				]}
			>
				<View style={styles.header}>
					{actor.photoSrcProd && (
						<Image
							source={{ uri: actor.photoSrcProd }}
							style={styles.profile}
							resizeMode="cover"
						/>
					)}
					<View style={styles.headerInfo}>
						<ThemedText style={styles.title}>
							{actor.fullname}
						</ThemedText>
						{actor.debut && (
							<ThemedText style={styles.debut}>
								Debut: {actor.debut}
							</ThemedText>
						)}
						{actor.ratings && actor.ratings.averageRating > 0 && (
							<View style={styles.userRating}>
								<ThemedText style={styles.userRatingText}>
									Rating:{" "}
									{actor.ratings.averageRating.toFixed(1)}/5
								</ThemedText>
								<ThemedText style={styles.reviewCount}>
									({actor.ratings.totalReviews} reviews)
								</ThemedText>
							</View>
						)}
					</View>
				</View>

				<View style={styles.actions}>
					<IconButton
						icon="pencil"
						size={28}
						iconColor={colors.text}
						onPress={handleWriteReview}
						style={[
							styles.actionButton,
							{ backgroundColor: colors.card },
						]}
					/>
				</View>

				{actor.description && (
					<Card
						style={[styles.card, { backgroundColor: colors.card }]}
					>
						<Card.Content>
							<ThemedText style={styles.sectionTitle}>
								Biography
							</ThemedText>
							<ThemedText style={styles.biography}>
								{actor.description}
							</ThemedText>
						</Card.Content>
					</Card>
				)}
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		padding: 16,
	},
	header: {
		flexDirection: "row",
		gap: 16,
		marginBottom: 16,
		alignItems: "center",
	},
	profile: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},
	headerInfo: {
		flex: 1,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 4,
		lineHeight: 34,
	},
	debut: {
		fontSize: 16,
		opacity: 0.7,
		marginTop: 4,
	},
	actions: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 16,
	},
	actionButton: {
		margin: 0,
	},
	card: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 8,
	},
	biography: {
		lineHeight: 22,
		opacity: 0.9,
	},
	userRating: {
		marginTop: 8,
	},
	userRatingText: {
		fontSize: 14,
		fontWeight: "600",
	},
	reviewCount: {
		fontSize: 12,
		opacity: 0.7,
		marginTop: 2,
	},
});
