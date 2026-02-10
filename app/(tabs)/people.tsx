import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, SegmentedButtons } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { actorService } from "@/lib/api/actor.service";
import { crewService } from "@/lib/api/crew.service";

export default function PeopleScreen() {
	const [personType, setPersonType] = useState("actors");
	const [refreshing, setRefreshing] = useState(false);

	const {
		data: actorsData,
		isLoading: actorsLoading,
		isError: actorsError,
		fetchNextPage: fetchNextActors,
		hasNextPage: hasNextActors,
		isFetchingNextPage: isFetchingNextActors,
		refetch: refetchActors,
	} = useInfiniteQuery({
		queryKey: ["actors"],
		queryFn: ({ pageParam = 1 }) =>
			actorService.getAll({ page: pageParam, perPage: 20 }),
		getNextPageParam: (lastPage, allPages) => {
			const currentPage = allPages.length;
			const totalPages = Math.ceil((lastPage.count || 0) / 20);
			return currentPage < totalPages ? currentPage + 1 : undefined;
		},
		initialPageParam: 1,
		enabled: personType === "actors",
	});

	const {
		data: crewData,
		isLoading: crewLoading,
		isError: crewError,
		fetchNextPage: fetchNextCrew,
		hasNextPage: hasNextCrew,
		isFetchingNextPage: isFetchingNextCrew,
		refetch: refetchCrew,
	} = useInfiniteQuery({
		queryKey: ["crew"],
		queryFn: ({ pageParam = 1 }) =>
			crewService.getAll({ page: pageParam, perPage: 20 }),
		getNextPageParam: (lastPage, allPages) => {
			const currentPage = allPages.length;
			const totalPages = Math.ceil((lastPage.count || 0) / 20);
			return currentPage < totalPages ? currentPage + 1 : undefined;
		},
		initialPageParam: 1,
		enabled: personType === "crew",
	});

	const isLoading = personType === "actors" ? actorsLoading : crewLoading;
	const isError = personType === "actors" ? actorsError : crewError;
	const actors = actorsData?.pages.flatMap((page) => page.actors || []) || [];
	const crew = crewData?.pages.flatMap((page) => page.crew || []) || [];
	const peopleList = personType === "actors" ? actors : crew;

	const onRefresh = async () => {
		setRefreshing(true);
		if (personType === "actors") {
			await refetchActors();
		} else {
			await refetchCrew();
		}
		setRefreshing(false);
	};

	const handleLoadMore = () => {
		if (personType === "actors") {
			if (hasNextActors && !isFetchingNextActors) {
				fetchNextActors();
			}
		} else {
			if (hasNextCrew && !isFetchingNextCrew) {
				fetchNextCrew();
			}
		}
	};

	const renderFooter = () => {
		const isFetching =
			personType === "actors" ? isFetchingNextActors : isFetchingNextCrew;
		if (!isFetching) return null;
		return (
			<View style={styles.footer}>
				<ActivityIndicator size="large" color="#e50914" />
				<ThemedText style={styles.loadingText}>
					Loading more {personType}...
				</ThemedText>
			</View>
		);
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
			) : peopleList.length === 0 ? (
				<View style={styles.loadingContainer}>
					<ThemedText style={styles.emptyText}>
						No {personType} found.
					</ThemedText>
				</View>
			) : (
				<FlatList
					data={peopleList}
					keyExtractor={(item) => `${personType}-${item.id}`}
					numColumns={2}
					columnWrapperStyle={styles.row}
					contentContainerStyle={styles.content}
					renderItem={({ item }) => (
						<Card
							style={styles.card}
							onPress={() => {
								const route =
									personType === "actors"
										? `/actors/${item.id}`
										: `/crew/${item.id}`;
								router.push(route as any);
							}}
						>
							<View style={styles.cardInner}>
								<Card.Cover
									source={{
										uri:
											item.photoSrcProd ||
											"https://via.placeholder.com/160x240",
									}}
									style={styles.cardImage}
								/>
								<Card.Content style={styles.cardContent}>
									<ThemedText
										style={styles.personName}
										numberOfLines={1}
									>
										{item.fullname}
									</ThemedText>
									{item.debut && (
										<ThemedText
											style={styles.knownFor}
											numberOfLines={1}
										>
											Debut: {item.debut}
										</ThemedText>
									)}
								</Card.Content>
							</View>
						</Card>
					)}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5}
					ListFooterComponent={renderFooter}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
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
	row: {
		justifyContent: "space-between",
	},
	card: {
		width: "48%",
		backgroundColor: "#1a1a1a",
		borderRadius: 12,
	},
	cardInner: {
		overflow: "hidden",
		borderRadius: 12,
	},
	cardImage: {
		height: 240,
		backgroundColor: "#2a2a2a",
	},
	cardContent: {
		paddingVertical: 12,
	},
	personName: {
		fontWeight: "600",
		fontSize: 14,
	},
	knownFor: {
		fontSize: 12,
		opacity: 0.7,
		marginTop: 4,
	},
	footer: {
		paddingVertical: 20,
		alignItems: "center",
	},
});
