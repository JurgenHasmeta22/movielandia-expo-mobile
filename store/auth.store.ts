import { authService } from "@/lib/api/auth.service";
import { AuthTokens, User } from "@/types";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface AuthState {
	user: User | null;
	tokens: AuthTokens | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (
		email: string,
		password: string,
		username: string,
		name?: string,
	) => Promise<void>;
	signOut: () => Promise<void>;
	loadUser: () => Promise<void>;
	updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	tokens: null,
	isLoading: true,
	isAuthenticated: false,

	signIn: async (email: string, password: string) => {
		try {
			const response = await authService.signIn({ email, password });

			await SecureStore.setItemAsync(
				"accessToken",
				response.tokens.accessToken,
			);
			await SecureStore.setItemAsync(
				"user",
				JSON.stringify(response.user),
			);

			set({
				user: response.user,
				tokens: response.tokens,
				isAuthenticated: true,
			});
		} catch (error) {
			throw error;
		}
	},

	signUp: async (
		email: string,
		password: string,
		username: string,
		name?: string,
	) => {
		try {
			await authService.signUp({ email, password, username, name });
		} catch (error) {
			throw error;
		}
	},

	signOut: async () => {
		try {
			await SecureStore.deleteItemAsync("accessToken");
			await SecureStore.deleteItemAsync("user");

			set({
				user: null,
				tokens: null,
				isAuthenticated: false,
			});
		} catch (error) {
			throw error;
		}
	},

	loadUser: async () => {
		try {
			set({ isLoading: true });

			const token = await SecureStore.getItemAsync("accessToken");
			const userStr = await SecureStore.getItemAsync("user");

			if (token && userStr) {
				const user = JSON.parse(userStr);
				set({
					user,
					tokens: { accessToken: token },
					isAuthenticated: true,
					isLoading: false,
				});
			} else {
				set({ isLoading: false });
			}
		} catch {
			set({
				user: null,
				tokens: null,
				isAuthenticated: false,
				isLoading: false,
			});
		}
	},

	updateUser: (user: User) => {
		set({ user });
		SecureStore.setItemAsync("user", JSON.stringify(user));
	},
}));
