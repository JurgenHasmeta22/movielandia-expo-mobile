import { API_CONFIG } from "@/config/api.config";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

class ApiClient {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: API_CONFIG.BASE_URL,
			timeout: API_CONFIG.TIMEOUT,
			headers: API_CONFIG.HEADERS,
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		this.client.interceptors.request.use(
			async (config) => {
				const token = await SecureStore.getItemAsync("accessToken");
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		this.client.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config;

				if (error.response?.status === 401 && originalRequest) {
					await SecureStore.deleteItemAsync("accessToken");
					await SecureStore.deleteItemAsync("user");
				}

				return Promise.reject(error);
			},
		);
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.get<T>(url, config);
		return response.data;
	}

	async post<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		try {
			const response = await this.client.post<T>(url, data, config);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const message = error.response?.data?.message || error.message;
				throw new Error(
					Array.isArray(message) ? message.join(", ") : message,
				);
			}
			throw error;
		}
	}

	async put<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response = await this.client.put<T>(url, data, config);
		return response.data;
	}

	async patch<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response = await this.client.patch<T>(url, data, config);
		return response.data;
	}

	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.delete<T>(url, config);
		return response.data;
	}
}

export const apiClient = new ApiClient();
