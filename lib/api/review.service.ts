import { ENDPOINTS } from "@/config/api.config";
import { PaginatedResponse, Review } from "@/types";
import { apiClient } from "./client";

export interface CreateReviewData {
	movieId?: number;
	serieId?: number;
	rating: number;
	title?: string;
	content: string;
}

export interface UpdateReviewData {
	rating?: number;
	title?: string;
	content?: string;
}

export const reviewService = {
	getAll: async (params?: {
		movieId?: number;
		serieId?: number;
		userId?: number;
		page?: number;
		perPage?: number;
	}): Promise<PaginatedResponse<Review>> => {
		return apiClient.get(ENDPOINTS.REVIEWS.GET_ALL, { params });
	},

	getOne: async (id: number): Promise<Review> => {
		return apiClient.get(
			ENDPOINTS.REVIEWS.GET_ONE.replace(":id", id.toString()),
		);
	},

	create: async (data: CreateReviewData): Promise<Review> => {
		return apiClient.post(ENDPOINTS.REVIEWS.CREATE, data);
	},

	update: async (id: number, data: UpdateReviewData): Promise<Review> => {
		return apiClient.put(
			ENDPOINTS.REVIEWS.UPDATE.replace(":id", id.toString()),
			data,
		);
	},

	delete: async (id: number): Promise<void> => {
		return apiClient.delete(
			ENDPOINTS.REVIEWS.DELETE.replace(":id", id.toString()),
		);
	},
};
