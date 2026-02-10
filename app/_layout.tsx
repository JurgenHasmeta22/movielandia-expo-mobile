import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider as NavigationTheme,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from "@/contexts/auth.context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { QueryProvider } from "@/providers/query.provider";
import { ThemeProvider } from "@/providers/theme.provider";
import { useAuthStore } from "@/store/auth.store";

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	return (
		<QueryProvider>
			<ThemeProvider>
				<AuthProvider>
					<NavigationTheme
						value={
							colorScheme === "dark" ? DarkTheme : DefaultTheme
						}
					>
						<Stack
							screenOptions={{
								headerShown: false,
							}}
						>
							{isAuthenticated ? (
								<Stack.Screen
									name="(tabs)"
									options={{ headerShown: false }}
								/>
							) : (
								<Stack.Screen
									name="(auth)"
									options={{ headerShown: false }}
								/>
							)}
							<Stack.Screen
								name="movies/[id]"
								options={{
									headerShown: true,
									title: "Movie Details",
								}}
							/>
							<Stack.Screen
								name="series/[id]"
								options={{
									headerShown: true,
									title: "Series Details",
								}}
							/>
							<Stack.Screen
								name="actors/[id]"
								options={{
									headerShown: true,
									title: "Actor Details",
								}}
							/>
						</Stack>
						<StatusBar style="auto" />
					</NavigationTheme>
				</AuthProvider>
			</ThemeProvider>
		</QueryProvider>
	);
}
