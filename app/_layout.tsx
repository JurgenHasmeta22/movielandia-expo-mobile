import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from "@/contexts/auth.context";
import { QueryProvider } from "@/providers/query.provider";
import { ThemeProvider } from "@/providers/theme.provider";

export default function RootLayout() {
	return (
		<QueryProvider>
			<ThemeProvider>
				<AuthProvider>
					<Stack>
						<Stack.Screen
							name="(tabs)"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="(auth)"
							options={{ headerShown: false }}
						/>
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
								title: "Serie Details",
							}}
						/>
						<Stack.Screen
							name="actors/[id]"
							options={{
								headerShown: true,
								title: "Actor Details",
							}}
						/>
						<Stack.Screen
							name="crew/[id]"
							options={{
								headerShown: true,
								title: "Crew Details",
							}}
						/>
						<Stack.Screen
							name="seasons/[id]"
							options={{
								headerShown: true,
								title: "Season Details",
							}}
						/>
						<Stack.Screen
							name="seasons/episodes/[id]"
							options={{
								headerShown: true,
								title: "Episode Details",
							}}
						/>
					</Stack>
					<StatusBar style="auto" />
				</AuthProvider>
			</ThemeProvider>
		</QueryProvider>
	);
}
