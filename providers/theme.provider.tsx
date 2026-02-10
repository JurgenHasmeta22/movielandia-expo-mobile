import { useColorScheme } from "@/hooks/use-color-scheme";
import { PropsWithChildren } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

const lightTheme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: "#1976d2",
		secondary: "#dc004e",
		background: "#ffffff",
		surface: "#f5f5f5",
		error: "#f44336",
	},
};

const darkTheme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		primary: "#90caf9",
		secondary: "#f48fb1",
		background: "#121212",
		surface: "#1e1e1e",
		error: "#cf6679",
	},
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
	const colorScheme = useColorScheme();
	const theme = colorScheme === "dark" ? darkTheme : lightTheme;

	return <PaperProvider theme={theme}>{children}</PaperProvider>;
};
