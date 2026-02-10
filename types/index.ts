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
	userName: string;
	name?: string;
}

export interface SignInData {
	emailOrUsername: string;
	password: string;
}

export interface MovieRatingInfo {
	averageRating: number;
	totalReviews: number;
}

export interface Movie {
	id: number;
	title: string;
	description: string;
	photoSrc?: string;
	photoSrcProd?: string;
	trailerSrc?: string;
	duration?: number;
	ratingImdb?: number;
	dateAired?: string;
	ratings?: MovieRatingInfo;
	genres?: Genre[];
	isBookmarked?: boolean;
	isReviewed?: boolean;
	reviews?: Review[];
}

export interface SerieRatingInfo {
	averageRating: number;
	totalReviews: number;
}

export interface Serie {
	id: number;
	title: string;
	description: string;
	photoSrc?: string;
	photoSrcProd?: string;
	trailerSrc?: string;
	dateAired?: string;
	ratingImdb?: number;
	ratings?: SerieRatingInfo;
	genres?: Genre[];
	isBookmarked?: boolean;
	isReviewed?: boolean;
	reviews?: Review[];
}

export interface SeasonRatingInfo {
	averageRating: number;
	totalReviews: number;
}

export interface Season {
	id: number;
	title: string;
	description: string;
	photoSrc: string;
	photoSrcProd: string;
	trailerSrc: string;
	ratingImdb: number;
	dateAired?: string;
	serieId: number;
	ratings?: SeasonRatingInfo;
	isBookmarked?: boolean;
	isReviewed?: boolean;
	reviews?: Review[];
}

export interface EpisodeRatingInfo {
	averageRating: number;
	totalReviews: number;
}

export interface Episode {
	id: number;
	title: string;
	description: string;
	photoSrc: string;
	photoSrcProd: string;
	trailerSrc: string;
	duration: number;
	ratingImdb: number;
	dateAired?: string;
	seasonId: number;
	ratings?: EpisodeRatingInfo;
	isBookmarked?: boolean;
	isReviewed?: boolean;
	reviews?: Review[];
}

export interface ActorRatingInfo {
	averageRating: number;
	totalReviews: number;
}

export interface Actor {
	id: number;
	fullname: string;
	photoSrc?: string;
	photoSrcProd?: string;
	description?: string;
	debut?: string;
	ratings?: ActorRatingInfo;
	isBookmarked?: boolean;
	isReviewed?: boolean;
	reviews?: Review[];
}

export interface CrewRatingInfo {
	averageRating: number;
	totalReviews: number;
}

export interface Crew {
	id: number;
	fullname: string;
	photoSrc?: string;
	photoSrcProd?: string;
	description?: string;
	debut?: string;
	ratings?: CrewRatingInfo;
	isBookmarked?: boolean;
	reviews?: Review[];
	isReviewed?: boolean;
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
	actorId?: number;
	crewId?: number;
	rating: number;
	title?: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	user: {
		id: number;
		userName: string;
		avatar?: string;
	};
	isUpvoted?: boolean;
	isDownvoted?: boolean;
	_count?: {
		upvotes: number;
		downvotes: number;
	};
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

export interface MovieListResponse {
	count: number;
	movies: Movie[];
}

export interface SerieListResponse {
	count: number;
	series: Serie[];
}

export interface ActorListResponse {
	count: number;
	actors: Actor[];
}

export interface CrewListResponse {
	count: number;
	crew: Crew[];
}

export interface SeasonListResponse {
	count: number;
	seasons: Season[];
}

export interface EpisodeListResponse {
	count: number;
	episodes: Episode[];
}

export interface ApiError {
	message: string;
	statusCode: number;
	errors?: Record<string, string[]>;
}
