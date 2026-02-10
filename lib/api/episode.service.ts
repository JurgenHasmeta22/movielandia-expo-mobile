import { ENDPOINTS } from "@/config/api.config";
import { Episode, PaginatedResponse } from "@/types";
import { apiClient } from "./client";

export interface EpisodeQuery {
	page?: number;
	perPage?: number;
	sortBy?: string;
	ascOrDesc?: "asc" | "desc";
}

export const episodeService = {
	getAll: async (
		query?: EpisodeQuery,
	): Promise<PaginatedResponse<Episode>> => {
		return apiClient.get(ENDPOINTS.EPISODES.GET_ALL, { params: query });
	},

	getOne: async (id: number): Promise<Episode> => {
		return apiClient.get(
			ENDPOINTS.EPISODES.GET_ONE.replace(":id", id.toString()),
		);
	},

	getBySeason: async (
		seasonId: number,
	): Promise<PaginatedResponse<Episode>> => {
		return apiClient.get(
			ENDPOINTS.EPISODES.GET_BY_SEASON.replace(
				":seasonId",
				seasonId.toString(),
			),
		);
	},
};
