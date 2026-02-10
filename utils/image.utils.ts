export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getPosterUrl = (
	path?: string | null,
	size:
		| "w92"
		| "w154"
		| "w185"
		| "w342"
		| "w500"
		| "w780"
		| "original" = "w500",
): string => {
	if (!path) return "";
	return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (
	path?: string | null,
	size: "w300" | "w780" | "w1280" | "original" = "w1280",
): string => {
	if (!path) return "";
	return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getProfileUrl = (
	path?: string | null,
	size: "w45" | "w185" | "h632" | "original" = "w185",
): string => {
	if (!path) return "";
	return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getImageUrl = getPosterUrl;
