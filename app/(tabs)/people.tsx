import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, SegmentedButtons } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { actorService } from "@/lib/api/actor.service";
import { crewService } from "@/lib/api/crew.service";

export default function PeopleScreen() {
	const [personType, setPersonType] = useState("actors");
	const [refreshing, setRefreshing] = useState(false);

	const {
		data: actors,
		isLoading: actorsLoading,
		isError: actorsError,
		refetch: refetchActors,
	} = useQuery({
		queryKey: ["actors"],
		queryFn: () => actorService.getAll({ page: 1, perPage: 100 }),
		enabled: personType === "actors",
	});

	const {
		data: crew,
		isLoading: crewLoading,
		isError: crewError,
		refetch: refetchCrew,
	} = useQuery({
		queryKey: ["crew"],
		queryFn: () => crewService.getAll({ page: 1, perPage: 100 }),
		enabled: personType === "crew",
	});

	const isLoading = personType === "actors" ? actorsLoading : crewLoading;
	const isError = personType === "actors" ? actorsError : crewError;
	const peopleList = personType === "actors" ? actors?.actors : crew?.crew;

	const onRefresh = async () => {
		setRefreshing(true);
		if (personType === "actors") {
			await refetchActors();
		} else {
			await refetchCrew();
		}
		setRefreshing(false);
	};

	return (
		<ThemedView style={styles.container}>
			<View style={styles.header}>
				<SegmentedButtons
					value={personType}
					onValueChange={setPersonType}
					buttons={[
						{
							value: "actors",
							label: "Actors",
							icon: "account-star",
						},
						{
							value: "crew",
							label: "Crew",
							icon: "account-group",
						},
					]}
					style={styles.segmented}
				/>
			</View>

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
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#e50914" />
						<ThemedText style={styles.loadingText}>
							Loading {personType}...
						</ThemedText>
					</View>
				) : isError ? (
					<View style={styles.loadingContainer}>
						<ThemedText style={styles.errorText}>
							Error loading {personType}. Pull to refresh.
						</ThemedText>
					</View>
				) : (peopleList || []).length === 0 ? (
					<View style={styles.loadingContainer}>
						<ThemedText style={styles.emptyText}>
							No {personType} found.
						</ThemedText>
					</View>
				) : (
					<View style={styles.grid}>
						{peopleList &&
							Array.isArray(peopleList) &&
							peopleList.map((person: any) => (
								<Card
									key={person.id}
									style={styles.card}
									onPress={() => {
										const route =
											personType === "actors"
												? `/actors/${person.id}`
												: `/crew/${person.id}`;
										router.push(route as any);
									}}
								>
									<Card.Cover
										source={{
											uri:
												person.photoSrcProd ||
												"https://via.placeholder.com/160x240",
										}}
										style={styles.cardImage}
									/>
									<Card.Content style={styles.cardContent}>
										<ThemedText
											style={styles.personName}
											numberOfLines={1}
										>
											{person.fullname || person.name}
										</ThemedText>
										{person.knownFor && (
											<ThemedText
												style={styles.knownFor}
												numberOfLines={1}
											>
												{person.knownFor}
											</ThemedText>
										)}
									</Card.Content>
								</Card>
							))}
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
	header: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(229, 9, 20, 0.1)",
	},
	segmented: {
		backgroundColor: "transparent",
	},
	content: {
		padding: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 40,
	},
	loadingText: {
		marginTop: 12,
		opacity: 0.7,
	},
	errorText: {
		color: "#f44336",
		opacity: 0.9,
	},
	emptyText: {
		opacity: 0.7,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: 12,
	},
	card: {
		width: "48%",
		marginBottom: 12,
		backgroundColor: "#1a1a1a",
		borderRadius: 12,
		overflow: "hidden",
	},
	cardImage: {
		height: 240,
		backgroundColor: "#2a2a2a",
	},
	cardContent: {
		paddingVertical: 12,
		paddingHorizontal: 8,
	},
	personName: {
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 4,
	},
	knownFor: {
		fontSize: 12,
		opacity: 0.7,
	},
});
