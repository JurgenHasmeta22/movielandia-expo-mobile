export const API_CONFIG = {
	BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
	TIMEOUT: 30000,
	HEADERS: {
		"Content-Type": "application/json",
	},
};

export const ENDPOINTS = {
	AUTH: {
		SIGN_IN: "/auth/signin",
		SIGN_UP: "/auth/signup",
		ACTIVATE: "/auth/activate",
		FORGOT_PASSWORD: "/auth/forgot-password",
		RESET_PASSWORD: "/auth/reset-password",
	},
	MOVIES: {
		GET_ALL: "/movies",
		GET_ONE: "/movies/:id",
		GET_LATEST: "/movies/latest",
		SEARCH: "/movies/search",
		GET_RELATED: "/movies/:id/related",
		COUNT: "/movies/count",
	},
	SERIES: {
		GET_ALL: "/series",
		GET_ONE: "/series/:id",
		GET_LATEST: "/series/latest",
		SEARCH: "/series/search",
		GET_RELATED: "/series/:id/related",
		GET_SEASONS: "/series/:id/seasons",
	},
	SEASONS: {
		GET_ALL: "/seasons",
		GET_ONE: "/seasons/:id",
		GET_BY_SERIE: "/seasons/serie/:serieId",
		GET_EPISODES: "/seasons/:seasonId/episodes",
		SEARCH: "/seasons/search",
	},
	EPISODES: {
		GET_ALL: "/episodes",
		GET_ONE: "/episodes/:id",
		GET_BY_SEASON: "/episodes/season/:seasonId",
		SEARCH: "/episodes/search",
	},
	ACTORS: {
		GET_ALL: "/actors",
		GET_ONE: "/actors/:id",
		SEARCH: "/actors/search",
	},
	CREW: {
		GET_ALL: "/crew",
		GET_ONE: "/crew/:id",
		SEARCH: "/crew/search",
	},
	GENRES: {
		GET_ALL: "/genres",
		GET_ONE: "/genres/:id",
	},
	REVIEWS: {
		GET_ALL: "/reviews",
		GET_ONE: "/reviews/:id",
		CREATE: "/reviews",
		UPDATE: "/reviews/:id",
		DELETE: "/reviews/:id",
	},
	LISTS: {
		GET_ALL: "/lists",
		GET_ONE: "/lists/:id",
		CREATE: "/lists",
		UPDATE: "/lists/:id",
		DELETE: "/lists/:id",
		ADD_ITEM: "/lists/:id/items",
		REMOVE_ITEM: "/lists/:id/items/:itemId",
	},
	FORUM: {
		GET_THREADS: "/forum/threads",
		GET_THREAD: "/forum/threads/:id",
		CREATE_THREAD: "/forum/threads",
		UPDATE_THREAD: "/forum/threads/:id",
		DELETE_THREAD: "/forum/threads/:id",
		CREATE_REPLY: "/forum/threads/:id/replies",
	},
	USERS: {
		GET_PROFILE: "/users/:id",
		UPDATE_PROFILE: "/users/:id",
		GET_FAVORITES: "/users/favorites/list",
		ADD_FAVORITE: "/users/favorites",
		REMOVE_FAVORITE: "/users/favorites",
		ADD_REVIEW: "/users/reviews",
		UPDATE_REVIEW: "/users/reviews/:itemId",
		DELETE_REVIEW: "/users/reviews/:itemId",
	},
};
