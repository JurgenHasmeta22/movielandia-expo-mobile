import { create } from "zustand";

interface AppState {
	theme: "light" | "dark" | "auto";
	setTheme: (theme: "light" | "dark" | "auto") => void;
}

export const useAppStore = create<AppState>((set) => ({
	theme: "auto",
	setTheme: (theme) => set({ theme }),
}));
