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
				headerStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].background,
				},
				headerTintColor: Colors[colorScheme ?? "light"].text,
				tabBarStyle: {
					paddingBottom: 8,
					paddingTop: 4,
					height: 60,
					backgroundColor: Colors[colorScheme ?? "light"].background,
					borderTopColor: Colors[colorScheme ?? "light"].border,
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
				name="people"
				options={{
					title: "People",
					headerTitle: "Actors & Crew",
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="account-group"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
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
				name="search"
				options={{
					href: null,
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
