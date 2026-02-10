import { ENDPOINTS } from "@/config/api.config";
import { Movie, Serie, User } from "@/types";
import { apiClient } from "./client";

export interface UpdateProfileData {
	username?: string;
	name?: string;
	bio?: string;
	avatar?: string;
}

export const userService = {
	getProfile: async (id: number): Promise<User> => {
		return apiClient.get(
			ENDPOINTS.USERS.GET_PROFILE.replace(":id", id.toString()),
		);
	},

	updateProfile: async (
		id: number,
		data: UpdateProfileData,
	): Promise<User> => {
		return apiClient.put(
			ENDPOINTS.USERS.UPDATE_PROFILE.replace(":id", id.toString()),
			data,
		);
	},

	getFavorites: async (id: number): Promise<(Movie | Serie)[]> => {
		return apiClient.get(
			ENDPOINTS.USERS.GET_FAVORITES.replace(":id", id.toString()),
		);
	},

	getWatchlist: async (id: number): Promise<(Movie | Serie)[]> => {
		return apiClient.get(
			ENDPOINTS.USERS.GET_WATCHLIST.replace(":id", id.toString()),
		);
	},

	addFavorite: async (
		id: number,
		itemId: number,
		type: "movie" | "serie",
	): Promise<void> => {
		return apiClient.post(
			ENDPOINTS.USERS.ADD_FAVORITE.replace(":id", id.toString()),
			{ itemId, type },
		);
	},

	removeFavorite: async (id: number, itemId: number): Promise<void> => {
		return apiClient.delete(
			ENDPOINTS.USERS.REMOVE_FAVORITE.replace(
				":id",
				id.toString(),
			).replace(":itemId", itemId.toString()),
		);
	},

	addToWatchlist: async (
		id: number,
		itemId: number,
		type: "movie" | "serie",
	): Promise<void> => {
		return apiClient.post(
			ENDPOINTS.USERS.ADD_TO_WATCHLIST.replace(":id", id.toString()),
			{ itemId, type },
		);
	},

	removeFromWatchlist: async (id: number, itemId: number): Promise<void> => {
		return apiClient.delete(
			ENDPOINTS.USERS.REMOVE_FROM_WATCHLIST.replace(
				":id",
				id.toString(),
			).replace(":itemId", itemId.toString()),
		);
	},
};
