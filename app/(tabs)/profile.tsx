import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/auth.store";

export default function ProfileScreen() {
	const user = useAuthStore((state) => state.user);
	const signOut = useAuthStore((state) => state.signOut);
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];

	const handleSignOut = async () => {
		await signOut();
		router.replace("/signin");
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					<ThemedText type="title">My Profile</ThemedText>
				</View>

				{user && (
					<View style={styles.section}>
						<ThemedText type="subtitle" style={styles.label}>
							Username
						</ThemedText>
						<ThemedText style={styles.value}>
							{user.username}
						</ThemedText>

						{user.name && (
							<>
								<ThemedText
									type="subtitle"
									style={styles.label}
								>
									Name
								</ThemedText>
								<ThemedText style={styles.value}>
									{user.name}
								</ThemedText>
							</>
						)}

						<ThemedText type="subtitle" style={styles.label}>
							Email
						</ThemedText>
						<ThemedText style={styles.value}>
							{user.email}
						</ThemedText>
					</View>
				)}

				<Divider style={styles.divider} />

				<View style={styles.actions}>
					<Button
						mode="outlined"
						icon="heart"
						onPress={() => router.push("/favorites")}
						style={styles.actionButton}
						textColor={colors.primary}
					>
						My Favorites
					</Button>
					<Button
						mode="outlined"
						icon="star"
						onPress={() => router.push("/reviews")}
						style={styles.actionButton}
						textColor={colors.primary}
					>
						My Reviews
					</Button>
				</View>

				<Button
					mode="contained"
					onPress={handleSignOut}
					style={styles.signOutButton}
					buttonColor="#dc004e"
				>
					Sign Out
				</Button>
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
		marginBottom: 24,
	},
	section: {
		marginBottom: 24,
	},
	label: {
		marginTop: 16,
		marginBottom: 4,
		fontSize: 14,
		opacity: 0.7,
	},
	value: {
		fontSize: 16,
	},
	divider: {
		marginBottom: 24,
	},
	actions: {
		gap: 12,
		marginBottom: 32,
	},
	actionButton: {
		borderRadius: 8,
	},
	signOutButton: {
		marginTop: 16,
	},
});
