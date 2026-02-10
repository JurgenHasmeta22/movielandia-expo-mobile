import { ENDPOINTS } from "@/config/api.config";
import { User } from "@/types";
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

	getFavorites: async (
		type: "movies" | "series",
		page = 1,
		search = "",
	): Promise<any> => {
		return apiClient.get(ENDPOINTS.USERS.GET_FAVORITES, {
			params: { type, page, search },
		});
	},

	addFavorite: async (
		itemId: number,
		type: "movies" | "series" | "season" | "episode",
	): Promise<void> => {
		return apiClient.post(ENDPOINTS.USERS.ADD_FAVORITE, { itemId, type });
	},

	removeFavorite: async (
		itemId: number,
		type: "movies" | "series" | "season" | "episode",
	): Promise<void> => {
		return apiClient.delete(ENDPOINTS.USERS.REMOVE_FAVORITE, {
			data: { itemId, type },
		});
	},

	addReview: async (
		itemId: number,
		itemType: "movie" | "serie" | "actor" | "crew" | "season" | "episode",
		reviewData: { content: string; rating: number },
	): Promise<any> => {
		if (itemType === "season") {
			return apiClient.post(ENDPOINTS.USERS.ADD_SEASON_REVIEW, {
				seasonId: itemId,
				...reviewData,
			});
		}
		if (itemType === "episode") {
			return apiClient.post(ENDPOINTS.USERS.ADD_EPISODE_REVIEW, {
				episodeId: itemId,
				...reviewData,
			});
		}
		return apiClient.post(ENDPOINTS.USERS.ADD_REVIEW, {
			itemId,
			itemType,
			...reviewData,
		});
	},

	updateReview: async (
		itemId: number,
		itemType: "movie" | "serie" | "actor" | "crew" | "season" | "episode",
		reviewData: { content: string; rating: number },
	): Promise<any> => {
		if (itemType === "season") {
			return apiClient.put(
				ENDPOINTS.USERS.UPDATE_SEASON_REVIEW.replace(
					":seasonId",
					itemId.toString(),
				),
				reviewData,
			);
		}
		if (itemType === "episode") {
			return apiClient.put(
				ENDPOINTS.USERS.UPDATE_EPISODE_REVIEW.replace(
					":episodeId",
					itemId.toString(),
				),
				reviewData,
			);
		}
		return apiClient.put(
			ENDPOINTS.USERS.UPDATE_REVIEW.replace(":itemId", itemId.toString()),
			{ itemType, ...reviewData },
		);
	},

	deleteReview: async (
		itemId: number,
		itemType: "movie" | "serie" | "actor" | "crew" | "season" | "episode",
	): Promise<void> => {
		if (itemType === "season") {
			return apiClient.delete(
				ENDPOINTS.USERS.DELETE_SEASON_REVIEW.replace(
					":seasonId",
					itemId.toString(),
				),
			);
		}
		if (itemType === "episode") {
			return apiClient.delete(
				ENDPOINTS.USERS.DELETE_EPISODE_REVIEW.replace(
					":episodeId",
					itemId.toString(),
				),
			);
		}
		return apiClient.delete(
			ENDPOINTS.USERS.DELETE_REVIEW.replace(":itemId", itemId.toString()),
			{ data: { itemType } },
		);
	},
};
