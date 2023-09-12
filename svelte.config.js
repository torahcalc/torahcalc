import dotenv from 'dotenv';
dotenv.config();

import adapterVercel from '@sveltejs/adapter-vercel';
import adapterStatic from '@sveltejs/adapter-static';

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
