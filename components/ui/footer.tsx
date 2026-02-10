import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<ThemedView style={styles.footer}>
			<View style={styles.content}>
				<View style={styles.iconRow}>
					<MaterialCommunityIcons
						name="movie-open"
						size={32}
						color="#e50914"
					/>
					<ThemedText style={styles.brandText}>
						MovieLandia24
					</ThemedText>
				</View>

				<ThemedText style={styles.tagline}>
					Your Gateway to the World of Cinema
				</ThemedText>

				<View style={styles.divider} />

				<ThemedText style={styles.description}>
					Explore the latest blockbusters and timeless classics in our
					curated collection of movies and series. Discover, rate, and
					share your favorite cinematic experiences.
				</ThemedText>

				<View style={styles.divider} />

				<ThemedText style={styles.copyright}>
					© {currentYear} MovieLandia24. All rights reserved.
				</ThemedText>

				<ThemedText style={styles.features}>
					Featuring thousands of titles across all genres
				</ThemedText>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	footer: {
		borderTopWidth: 1,
		borderTopColor: "rgba(229, 9, 20, 0.2)",
		marginTop: 24,
	},
	content: {
		padding: 24,
		alignItems: "center",
	},
	iconRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 8,
	},
	brandText: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#e50914",
	},
	tagline: {
		fontSize: 14,
		fontWeight: "600",
		textAlign: "center",
		marginBottom: 12,
		opacity: 0.9,
	},
	description: {
		fontSize: 13,
		textAlign: "center",
		lineHeight: 20,
		opacity: 0.7,
		marginBottom: 12,
	},
	divider: {
		width: "60%",
		height: 1,
		backgroundColor: "rgba(0,0,0,0.1)",
		marginVertical: 12,
	},
	copyright: {
		fontSize: 12,
		opacity: 0.6,
		marginBottom: 4,
	},
	features: {
		fontSize: 11,
		opacity: 0.5,
		fontStyle: "italic",
	},
});
