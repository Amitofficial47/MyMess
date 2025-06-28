export const fetchApi = (path: string, options?: RequestInit) => {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
	// Ensure path starts with a slash
	const formattedPath = path.startsWith("/") ? path : `/${path}`;
	return fetch(`${baseUrl}${formattedPath}`, options);
};
