import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { crewService } from "@/lib/api/crew.service";

export default function CrewDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: crew, isLoading } = useQuery({
		queryKey: ["crew", id],
		queryFn: () => crewService.getOne(Number(id)),
		enabled: !!id,
	});

	if (isLoading) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Loading...</ThemedText>
			</ThemedView>
		);
	}

	if (!crew) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Crew member not found</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					{crew.photoSrcProd && (
						<Image
							source={{ uri: crew.photoSrcProd }}
							style={styles.profile}
						/>
					)}
					<View style={styles.headerInfo}>
						<ThemedText type="title">{crew.fullname}</ThemedText>
						{crew.debut && (
							<ThemedText style={styles.department}>
								Debut: {crew.debut}
							</ThemedText>
						)}
						{crew.ratings && crew.ratings.averageRating > 0 && (
							<View style={styles.userRating}>
								<ThemedText style={styles.userRatingText}>
									Rating:{" "}
									{crew.ratings.averageRating.toFixed(1)}/5
								</ThemedText>
								<ThemedText style={styles.reviewCount}>
									({crew.ratings.totalReviews} reviews)
								</ThemedText>
							</View>
						)}
					</View>
				</View>

				{crew.description && (
					<Card style={styles.card}>
						<Card.Content>
							<ThemedText type="subtitle">Biography</ThemedText>
							<ThemedText style={styles.biography}>
								{crew.description}
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
	department: {
		fontSize: 16,
		opacity: 0.7,
		marginTop: 4,
	},
	card: {
		marginBottom: 16,
	},
	biography: {
		marginTop: 8,
		lineHeight: 22,
	},
	detailRow: {
		flexDirection: "row",
		marginTop: 8,
	},
	detailLabel: {
		fontWeight: "600",
		marginRight: 8,
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
