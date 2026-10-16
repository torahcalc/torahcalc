import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_ADAPTER: { public: true, static: true },
	PUBLIC_BASE_URL: { public: true, static: true },
	GOOGLE_MAPS_API_KEY: {},
	GEONAMES_USERNAME: {},
	MAPBOX_ACCESS_TOKEN: {},
});
