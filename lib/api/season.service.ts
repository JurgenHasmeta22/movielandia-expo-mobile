import { ENDPOINTS } from "@/config/api.config";
import {
    Episode,
    PaginatedResponse,
    Season
} from "@/types";
import { apiClient } from "./client";

export interface SeasonQuery {
	page?: number;
	perPage?: number;
	sortBy?: string;
	ascOrDesc?: "asc" | "desc";
}

export const seasonService = {
	getAll: async (query?: SeasonQuery): Promise<PaginatedResponse<Season>> => {
		return apiClient.get(ENDPOINTS.SEASONS.GET_ALL, { params: query });
	},

	getOne: async (id: number): Promise<Season> => {
		return apiClient.get(
			ENDPOINTS.SEASONS.GET_ONE.replace(":id", id.toString()),
		);
	},

	getBySerie: async (serieId: number): Promise<PaginatedResponse<Season>> => {
		return apiClient.get(
			ENDPOINTS.SEASONS.GET_BY_SERIE.replace(
				":serieId",
				serieId.toString(),
			),
		);
	},

	getEpisodes: async (seasonId: number): Promise<Episode[]> => {
		return apiClient.get(
			ENDPOINTS.SEASONS.GET_EPISODES.replace(
				":seasonId",
				seasonId.toString(),
			),
		);
	},
};
