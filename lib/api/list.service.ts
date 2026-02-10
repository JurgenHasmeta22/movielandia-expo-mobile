import { ENDPOINTS } from "@/config/api.config";
import { List, PaginatedResponse } from "@/types";
import { apiClient } from "./client";

export interface CreateListData {
	name: string;
	description?: string;
	isPublic: boolean;
}

export interface UpdateListData {
	name?: string;
	description?: string;
	isPublic?: boolean;
}

export interface AddListItemData {
	movieId?: number;
	serieId?: number;
}

export const listService = {
	getAll: async (params?: {
		userId?: number;
		page?: number;
		perPage?: number;
	}): Promise<PaginatedResponse<List>> => {
		return apiClient.get(ENDPOINTS.LISTS.GET_ALL, { params });
	},

	getOne: async (id: number): Promise<List> => {
		return apiClient.get(
			ENDPOINTS.LISTS.GET_ONE.replace(":id", id.toString()),
		);
	},

	create: async (data: CreateListData): Promise<List> => {
		return apiClient.post(ENDPOINTS.LISTS.CREATE, data);
	},

	update: async (id: number, data: UpdateListData): Promise<List> => {
		return apiClient.put(
			ENDPOINTS.LISTS.UPDATE.replace(":id", id.toString()),
			data,
		);
	},

	delete: async (id: number): Promise<void> => {
		return apiClient.delete(
			ENDPOINTS.LISTS.DELETE.replace(":id", id.toString()),
		);
	},

	addItem: async (listId: number, data: AddListItemData): Promise<List> => {
		return apiClient.post(
			ENDPOINTS.LISTS.ADD_ITEM.replace(":id", listId.toString()),
			data,
		);
	},

	removeItem: async (listId: number, itemId: number): Promise<void> => {
		return apiClient.delete(
			ENDPOINTS.LISTS.REMOVE_ITEM.replace(
				":id",
				listId.toString(),
			).replace(":itemId", itemId.toString()),
		);
	},
};
