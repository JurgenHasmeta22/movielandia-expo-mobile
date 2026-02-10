import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: true,
				tabBarButton: HapticTab,
				tabBarStyle: {
					paddingBottom: 5,
					paddingTop: 5,
					height: 60,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					headerTitle: "MovieLandia",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="home"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="movies"
				options={{
					title: "Movies",
					headerTitle: "Movies",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="movie"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="series"
				options={{
					title: "Series",
					headerTitle: "TV Series",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="television"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					headerTitle: "Search",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="magnify"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					headerTitle: "My Profile",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="account"
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
