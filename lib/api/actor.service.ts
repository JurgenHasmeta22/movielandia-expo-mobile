import { ENDPOINTS } from "@/config/api.config";
import { Actor, ActorListResponse } from "@/types";
import { apiClient } from "./client";

export interface ActorQuery {
	page?: number;
	perPage?: number;
	sortBy?: string;
	ascOrDesc?: "asc" | "desc";
}

export const actorService = {
	getAll: async (params?: ActorQuery): Promise<ActorListResponse> => {
		return apiClient.get(ENDPOINTS.ACTORS.GET_ALL, { params });
	},

	getOne: async (id: number): Promise<Actor> => {
		return apiClient.get(
			ENDPOINTS.ACTORS.GET_ONE.replace(":id", id.toString()),
		);
	},

	search: async (
		fullname: string,
		params?: { page?: number; perPage?: number },
	): Promise<ActorListResponse> => {
		return apiClient.get(ENDPOINTS.ACTORS.SEARCH, {
			params: { fullname, ...params },
		});
	},
};
