export default {
	async fetch(request) {
		const cacheDuration = 600;
		const cacheKey = new Request(request.url, request);
		const cache = caches.default;

		try {
			let response = await cache.match(cacheKey);

			if (!response) {
				const headers = new Headers({
					'Accept-Encoding': 'br, gzip',
				});

				const apiResponse = await fetch('https://techcrunch.com/wp-json/wp/v2/posts?per_page=100&context=embed', {
					method: 'GET',
					headers,
				});

				const responseBody = await apiResponse.text();

				const newHeaders = new Headers(apiResponse.headers);
				newHeaders.set('Access-Control-Allow-Origin', '*');
				newHeaders.set('Access-Control-Allow-Methods', 'GET');
				newHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
				newHeaders.set('Cache-Control', `max-age=${cacheDuration}`); // Set cache duration

				response = new Response(responseBody, {
					status: apiResponse.status,
					statusText: apiResponse.statusText,
					headers: newHeaders,
				});

				await cache.put(cacheKey, response.clone());
			}

			return response;
		} catch (error) {
			console.error('Fetch failed:', error);

			return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}
	},
};
