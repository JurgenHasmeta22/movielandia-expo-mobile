import { ENDPOINTS } from "@/config/api.config";
import { Genre } from "@/types";
import { apiClient } from "./client";

export const genreService = {
	getAll: async (): Promise<Genre[]> => {
		return apiClient.get(ENDPOINTS.GENRES.GET_ALL);
	},

	getOne: async (id: number): Promise<Genre> => {
		return apiClient.get(
			ENDPOINTS.GENRES.GET_ONE.replace(":id", id.toString()),
		);
	},
};
