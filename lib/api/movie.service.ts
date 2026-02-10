import { ENDPOINTS } from "@/config/api.config";
import { Movie, MovieListResponse, PaginatedResponse } from "@/types";
import { apiClient } from "./client";

export interface MovieQuery {
	page?: number;
	perPage?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	genreId?: number;
	year?: number;
	minRating?: number;
}

export const movieService = {
	getAll: async (query?: MovieQuery): Promise<MovieListResponse> => {
		return apiClient.get(ENDPOINTS.MOVIES.GET_ALL, { params: query });
	},

	getOne: async (id: number): Promise<Movie> => {
		return apiClient.get(
			ENDPOINTS.MOVIES.GET_ONE.replace(":id", id.toString()),
		);
	},

	getLatest: async (): Promise<Movie[]> => {
		return apiClient.get(ENDPOINTS.MOVIES.GET_LATEST);
	},

	search: async (
		title: string,
		query?: MovieQuery,
	): Promise<PaginatedResponse<Movie>> => {
		return apiClient.get(ENDPOINTS.MOVIES.SEARCH, {
			params: { title, ...query },
		});
	},

	getRelated: async (
		id: number,
		page = 1,
		perPage = 6,
	): Promise<PaginatedResponse<Movie>> => {
		return apiClient.get(
			ENDPOINTS.MOVIES.GET_RELATED.replace(":id", id.toString()),
			{ params: { page, perPage } },
		);
	},

	getCount: async (): Promise<{ count: number }> => {
		return apiClient.get(ENDPOINTS.MOVIES.COUNT);
	},
};
