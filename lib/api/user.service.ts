import { ENDPOINTS } from "@/config/api.config";
import {
	FavoriteType,
	FavoritesListResponse,
	ReviewItemType,
	User,
	UserReviewsResponse,
} from "@/types";
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
		type: FavoriteType,
		page = 1,
		search = "",
	): Promise<FavoritesListResponse> => {
		return apiClient.get(ENDPOINTS.USERS.GET_FAVORITES, {
			params: { type, page, search },
		});
	},

	addFavorite: async (itemId: number, type: FavoriteType): Promise<void> => {
		return apiClient.post(ENDPOINTS.USERS.ADD_FAVORITE, { itemId, type });
	},

	removeFavorite: async (
		itemId: number,
		type: FavoriteType,
	): Promise<void> => {
		return apiClient.delete(ENDPOINTS.USERS.REMOVE_FAVORITE, {
			data: { itemId, type },
		});
	},

	getMyReviews: async (
		page = 1,
		itemType?: ReviewItemType,
	): Promise<UserReviewsResponse> => {
		const params: Record<string, any> = { page };
		if (itemType) params.itemType = itemType;
		return apiClient.get(ENDPOINTS.USERS.GET_REVIEWS, { params });
	},

	addReview: async (
		itemId: number,
		itemType: ReviewItemType,
		reviewData: { content: string; rating: number },
	): Promise<any> => {
		return apiClient.post(ENDPOINTS.USERS.ADD_REVIEW, {
			itemId,
			itemType,
			...reviewData,
		});
	},

	updateReview: async (
		itemId: number,
		itemType: ReviewItemType,
		reviewData: { content: string; rating: number },
	): Promise<any> => {
		return apiClient.put(
			ENDPOINTS.USERS.UPDATE_REVIEW.replace(":itemId", itemId.toString()),
			{ itemType, ...reviewData },
		);
	},

	deleteReview: async (
		itemId: number,
		itemType: ReviewItemType,
	): Promise<void> => {
		return apiClient.delete(
			ENDPOINTS.USERS.DELETE_REVIEW.replace(":itemId", itemId.toString()),
			{ data: { itemType } },
		);
	},
};
