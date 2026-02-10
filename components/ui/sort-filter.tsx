import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, IconButton } from "react-native-paper";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export interface SortOption {
	value: string;
	label: string;
}

interface SortFilterProps {
	sortOptions: SortOption[];
	selectedSort: string;
	sortOrder: "asc" | "desc";
	onSortChange: (sort: string) => void;
	onOrderChange: () => void;
}

export const SortFilter: React.FC<SortFilterProps> = ({
	sortOptions,
	selectedSort,
	sortOrder,
	onSortChange,
	onOrderChange,
}) => {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];

	return (
		<View style={styles.container}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{sortOptions.map((option) => (
					<Chip
						key={option.value}
						selected={selectedSort === option.value}
						onPress={() => onSortChange(option.value)}
						style={[
							styles.chip,
							{
								backgroundColor:
									selectedSort === option.value
										? colors.primary
										: colors.card,
							},
						]}
						textStyle={[
							styles.chipText,
							{
								color:
									selectedSort === option.value
										? "#fff"
										: colors.text,
							},
						]}
					>
						{option.label}
					</Chip>
				))}
			</ScrollView>
			<IconButton
				icon={() => (
					<MaterialCommunityIcons
						name={
							sortOrder === "asc"
								? "sort-ascending"
								: "sort-descending"
						}
						size={24}
						color={colors.primary}
					/>
				)}
				onPress={onOrderChange}
				style={styles.sortButton}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	scrollContent: {
		flexDirection: "row",
		gap: 8,
		paddingRight: 8,
	},
	chip: {
		marginHorizontal: 2,
	},
	chipText: {
		fontSize: 13,
	},
	sortButton: {
		margin: 0,
	},
});
