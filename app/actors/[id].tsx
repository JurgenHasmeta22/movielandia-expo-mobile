import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { actorService } from "@/lib/api/actor.service";
import { formatDate } from "@/utils/format.utils";
import { getProfileUrl } from "@/utils/image.utils";

export default function ActorDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: actor, isLoading } = useQuery({
		queryKey: ["actor", id],
		queryFn: () => actorService.getOne(Number(id)),
		enabled: !!id,
	});

	if (isLoading) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Loading...</ThemedText>
			</ThemedView>
		);
	}

	if (!actor) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Actor not found</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					{actor.profilePath && (
						<Image
							source={{ uri: getProfileUrl(actor.profilePath) }}
							style={styles.profile}
						/>
					)}
					<View style={styles.headerInfo}>
						<ThemedText type="title">{actor.name}</ThemedText>
						{actor.knownForDepartment && (
							<ThemedText style={styles.department}>
								{actor.knownForDepartment}
							</ThemedText>
						)}
					</View>
				</View>

				{actor.biography && (
					<Card style={styles.card}>
						<Card.Content>
							<ThemedText type="subtitle">Biography</ThemedText>
							<ThemedText style={styles.biography}>
								{actor.biography}
							</ThemedText>
						</Card.Content>
					</Card>
				)}

				{(actor.birthday || actor.placeOfBirth) && (
					<Card style={styles.card}>
						<Card.Content>
							<ThemedText type="subtitle">
								Personal Info
							</ThemedText>
							{actor.birthday && (
								<View style={styles.detailRow}>
									<ThemedText style={styles.detailLabel}>
										Born:
									</ThemedText>
									<ThemedText>
										{formatDate(actor.birthday)}
									</ThemedText>
								</View>
							)}
							{actor.placeOfBirth && (
								<View style={styles.detailRow}>
									<ThemedText style={styles.detailLabel}>
										Place of Birth:
									</ThemedText>
									<ThemedText>
										{actor.placeOfBirth}
									</ThemedText>
								</View>
							)}
							{actor.deathday && (
								<View style={styles.detailRow}>
									<ThemedText style={styles.detailLabel}>
										Died:
									</ThemedText>
									<ThemedText>
										{formatDate(actor.deathday)}
									</ThemedText>
								</View>
							)}
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
});
