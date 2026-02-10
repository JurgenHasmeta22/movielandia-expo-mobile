import { ENDPOINTS } from "@/config/api.config";
import { AuthTokens, SignInData, SignUpData, User } from "@/types";
import { apiClient } from "./client";

export const authService = {
	signIn: async (
		data: SignInData,
	): Promise<{ user: User; tokens: AuthTokens }> => {
		return apiClient.post(ENDPOINTS.AUTH.SIGN_IN, data);
	},

	signUp: async (data: SignUpData): Promise<{ message: string }> => {
		return apiClient.post(ENDPOINTS.AUTH.SIGN_UP, data);
	},

	activateAccount: async (token: string): Promise<{ message: string }> => {
		return apiClient.post(ENDPOINTS.AUTH.ACTIVATE, { token });
	},

	forgotPassword: async (email: string): Promise<{ message: string }> => {
		return apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
	},

	resetPassword: async (
		token: string,
		password: string,
	): Promise<{ message: string }> => {
		return apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
			token,
			password,
		});
	},
};
