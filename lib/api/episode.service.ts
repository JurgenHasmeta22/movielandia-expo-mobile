import { ENDPOINTS } from "@/config/api.config";
import { Episode, EpisodeListResponse } from "@/types";
import { apiClient } from "./client";

export interface EpisodeQuery {
	page?: number;
	perPage?: number;
	sortBy?: string;
	ascOrDesc?: "asc" | "desc";
}

export const episodeService = {
	getAll: async (query?: EpisodeQuery): Promise<EpisodeListResponse> => {
		return apiClient.get(ENDPOINTS.EPISODES.GET_ALL, { params: query });
	},

	getOne: async (id: number): Promise<Episode> => {
		return apiClient.get(
			ENDPOINTS.EPISODES.GET_ONE.replace(":id", id.toString()),
		);
	},

	getBySeason: async (seasonId: number): Promise<EpisodeListResponse> => {
		return apiClient.get(
			ENDPOINTS.EPISODES.GET_BY_SEASON.replace(
				":seasonId",
				seasonId.toString(),
			),
		);
	},

	search: async (
		title: string,
		params?: { page?: number; perPage?: number },
	): Promise<EpisodeListResponse> => {
		return apiClient.get(ENDPOINTS.EPISODES.SEARCH, {
			params: { title, ...params },
		});
	},
};
