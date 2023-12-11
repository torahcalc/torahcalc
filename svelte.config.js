import dotenv from 'dotenv';
dotenv.config();

import adapterStatic from '@sveltejs/adapter-static';
import adapterVercel from '@sveltejs/adapter-vercel';

const config = {
	kit: {
		adapter:
			process.env.PUBLIC_ADAPTER === 'static'
				? adapterStatic({
						pages: 'build',
						assets: 'build',
						fallback: undefined,
						precompress: false,
						strict: false,
					})
				: adapterVercel(),
	},
};

export default config;
