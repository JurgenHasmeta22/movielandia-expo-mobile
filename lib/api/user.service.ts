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
		type: "movies" | "series",
	): Promise<void> => {
		return apiClient.post(ENDPOINTS.USERS.ADD_FAVORITE, { itemId, type });
	},

	removeFavorite: async (
		itemId: number,
		type: "movies" | "series",
	): Promise<void> => {
		return apiClient.delete(ENDPOINTS.USERS.REMOVE_FAVORITE, {
			data: { itemId, type },
		});
	},

	addReview: async (dto: {
		itemId: number;
		itemType: "movie" | "serie" | "actor" | "crew";
		content: string;
		rating: number;
	}): Promise<any> => {
		return apiClient.post(ENDPOINTS.USERS.ADD_REVIEW, dto);
	},

	updateReview: async (
		itemId: number,
		dto: {
			itemType: "movie" | "serie" | "actor" | "crew";
			content: string;
			rating: number;
		},
	): Promise<any> => {
		return apiClient.put(
			ENDPOINTS.USERS.UPDATE_REVIEW.replace(":itemId", itemId.toString()),
			dto,
		);
	},

	removeReview: async (
		itemId: number,
		itemType: "movie" | "serie" | "actor" | "crew",
	): Promise<void> => {
		return apiClient.delete(
			ENDPOINTS.USERS.DELETE_REVIEW.replace(":itemId", itemId.toString()),
			{ data: { itemType } },
		);
	},
};
