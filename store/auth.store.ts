import { authService } from "@/lib/api/auth.service";
import { AuthTokens, User } from "@/types";
import { secureStorage } from "@/utils/storage.utils";
import { create } from "zustand";

interface AuthState {
	user: User | null;
	tokens: AuthTokens | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	signIn: (emailOrUsername: string, password: string) => Promise<void>;
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

	signIn: async (emailOrUsername: string, password: string) => {
		try {
			const response = await authService.signIn({
				emailOrUsername,
				password,
			});

			await secureStorage.setItem("accessToken", response.accessToken);

			const isEmail = emailOrUsername.includes("@");
			const user: User = {
				id: 0,
				email: isEmail
					? emailOrUsername
					: `${emailOrUsername}@email.com`,
				username: isEmail
					? emailOrUsername.split("@")[0]
					: emailOrUsername,
				isActive: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			await secureStorage.setItem("user", JSON.stringify(user));

			set({
				user: user,
				tokens: { accessToken: response.accessToken },
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
			await authService.signUp({
				email,
				password,
				userName: username,
				name,
			});
		} catch (error) {
			throw error;
		}
	},

	signOut: async () => {
		try {
			await secureStorage.deleteItem("accessToken");
			await secureStorage.deleteItem("user");

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

			const token = await secureStorage.getItem("accessToken");
			const userStr = await secureStorage.getItem("user");

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
		secureStorage.setItem("user", JSON.stringify(user));
	},
}));
