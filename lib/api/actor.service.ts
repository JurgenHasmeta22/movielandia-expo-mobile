import { ENDPOINTS } from "@/config/api.config";
import { Actor, PaginatedResponse } from "@/types";
import { apiClient } from "./client";

export const actorService = {
	getAll: async (params?: {
		page?: number;
		perPage?: number;
	}): Promise<PaginatedResponse<Actor>> => {
		return apiClient.get(ENDPOINTS.ACTORS.GET_ALL, { params });
	},

	getOne: async (id: number): Promise<Actor> => {
		return apiClient.get(
			ENDPOINTS.ACTORS.GET_ONE.replace(":id", id.toString()),
		);
	},

	search: async (
		name: string,
		params?: { page?: number; perPage?: number },
	): Promise<PaginatedResponse<Actor>> => {
		return apiClient.get(ENDPOINTS.ACTORS.SEARCH, {
			params: { name, ...params },
		});
	},
};
