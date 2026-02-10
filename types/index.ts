export interface User {
	id: number;
	email: string;
	username: string;
	name?: string;
	avatar?: string;
	bio?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken?: string;
}

export interface SignUpData {
	email: string;
	password: string;
	username: string;
	name?: string;
}

export interface SignInData {
	email: string;
	password: string;
}

export interface Movie {
	id: number;
	title: string;
	originalTitle?: string;
	overview?: string;
	posterPath?: string;
	backdropPath?: string;
	releaseDate?: string;
	runtime?: number;
	budget?: number;
	revenue?: number;
	popularity?: number;
	voteAverage?: number;
	voteCount?: number;
	adult: boolean;
	genres?: Genre[];
	isFavorite?: boolean;
	isInWatchlist?: boolean;
}

export interface Serie {
	id: number;
	title: string;
	originalTitle?: string;
	overview?: string;
	posterPath?: string;
	backdropPath?: string;
	firstAirDate?: string;
	lastAirDate?: string;
	numberOfSeasons?: number;
	numberOfEpisodes?: number;
	status?: string;
	popularity?: number;
	voteAverage?: number;
	voteCount?: number;
	genres?: Genre[];
	isFavorite?: boolean;
	isInWatchlist?: boolean;
}

export interface Season {
	id: number;
	serieId: number;
	seasonNumber: number;
	name?: string;
	overview?: string;
	posterPath?: string;
	airDate?: string;
	episodeCount?: number;
}

export interface Episode {
	id: number;
	seasonId: number;
	episodeNumber: number;
	name?: string;
	overview?: string;
	stillPath?: string;
	airDate?: string;
	runtime?: number;
	voteAverage?: number;
	voteCount?: number;
}

export interface Actor {
	id: number;
	name: string;
	biography?: string;
	profilePath?: string;
	birthday?: string;
	deathday?: string;
	placeOfBirth?: string;
	popularity?: number;
	knownForDepartment?: string;
}

export interface Crew {
	id: number;
	name: string;
	biography?: string;
	profilePath?: string;
	birthday?: string;
	deathday?: string;
	placeOfBirth?: string;
	popularity?: number;
	knownForDepartment?: string;
}

export interface Genre {
	id: number;
	name: string;
	slug?: string;
}

export interface Review {
	id: number;
	userId: number;
	movieId?: number;
	serieId?: number;
	rating: number;
	title?: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	user?: User;
}

export interface List {
	id: number;
	userId: number;
	name: string;
	description?: string;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
	items?: ListItem[];
	user?: User;
}

export interface ListItem {
	id: number;
	listId: number;
	movieId?: number;
	serieId?: number;
	createdAt: string;
	movie?: Movie;
	serie?: Serie;
}

export interface ForumThread {
	id: number;
	userId: number;
	title: string;
	content: string;
	isPinned: boolean;
	isLocked: boolean;
	viewCount: number;
	replyCount: number;
	createdAt: string;
	updatedAt: string;
	user?: User;
	category?: ForumCategory;
	tags?: ForumTag[];
}

export interface ForumReply {
	id: number;
	threadId: number;
	userId: number;
	content: string;
	createdAt: string;
	updatedAt: string;
	user?: User;
}

export interface ForumCategory {
	id: number;
	name: string;
	slug: string;
	description?: string;
}

export interface ForumTag {
	id: number;
	name: string;
	slug: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		total: number;
		page: number;
		perPage: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface ApiError {
	message: string;
	statusCode: number;
	errors?: Record<string, string[]>;
}
