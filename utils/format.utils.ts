export const formatDate = (dateString?: string): string => {
	if (!dateString) return "N/A";

	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const formatShortDate = (dateString?: string): string => {
	if (!dateString) return "N/A";

	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

export const formatYear = (dateString?: string): string => {
	if (!dateString) return "N/A";

	const date = new Date(dateString);
	return date.getFullYear().toString();
};

export const formatRuntime = (minutes?: number): string => {
	if (!minutes) return "N/A";

	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (hours === 0) return `${mins}m`;
	if (mins === 0) return `${hours}h`;

	return `${hours}h ${mins}m`;
};

export const formatMoney = (amount?: number): string => {
	if (!amount) return "N/A";

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

export const formatRating = (rating?: number): string => {
	if (!rating) return "N/A";
	return rating.toFixed(1);
};
