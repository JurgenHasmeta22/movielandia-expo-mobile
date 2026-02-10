import { ENDPOINTS } from "@/config/api.config";
import { PaginatedResponse, Season, Serie, SerieListResponse } from "@/types";
import { apiClient } from "./client";

export interface SerieQuery {
	page?: number;
	perPage?: number;
	sortBy?: string;
	ascOrDesc?: "asc" | "desc";
	genreId?: number;
	year?: number;
	minRating?: number;
}

export const serieService = {
	getAll: async (query?: SerieQuery): Promise<SerieListResponse> => {
		return apiClient.get(ENDPOINTS.SERIES.GET_ALL, { params: query });
	},

	getOne: async (id: number): Promise<Serie> => {
		return apiClient.get(
			ENDPOINTS.SERIES.GET_ONE.replace(":id", id.toString()),
		);
	},

	getLatest: async (): Promise<Serie[]> => {
		return apiClient.get(ENDPOINTS.SERIES.GET_LATEST);
	},

	search: async (
		title: string,
		query?: SerieQuery,
	): Promise<PaginatedResponse<Serie>> => {
		return apiClient.get(ENDPOINTS.SERIES.SEARCH, {
			params: { title, ...query },
		});
	},

	getRelated: async (
		id: number,
		page = 1,
		perPage = 6,
	): Promise<PaginatedResponse<Serie>> => {
		return apiClient.get(
			ENDPOINTS.SERIES.GET_RELATED.replace(":id", id.toString()),
			{ params: { page, perPage } },
		);
	},

	getSeasons: async (id: number): Promise<Season[]> => {
		return apiClient.get(
			ENDPOINTS.SERIES.GET_SEASONS.replace(":id", id.toString()),
		);
	},
};
