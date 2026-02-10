import { ENDPOINTS } from "@/config/api.config";
import { Crew, CrewListResponse, PaginatedResponse } from "@/types";
import { apiClient } from "./client";

export interface CrewQuery {
	page?: number;
	perPage?: number;
	sortBy?: string;
	ascOrDesc?: "asc" | "desc";
}

export const crewService = {
	getAll: async (query?: CrewQuery): Promise<CrewListResponse> => {
		return apiClient.get(ENDPOINTS.CREW.GET_ALL, { params: query });
	},

	getOne: async (id: number): Promise<Crew> => {
		return apiClient.get(
			ENDPOINTS.CREW.GET_ONE.replace(":id", id.toString()),
		);
	},

	search: async (
		name: string,
		query?: CrewQuery,
	): Promise<PaginatedResponse<Crew>> => {
		return apiClient.get(ENDPOINTS.CREW.SEARCH, {
			params: { name, ...query },
		});
	},
};
