import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import adapterStatic from '@sveltejs/adapter-static';
import adapterVercel from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

dotenv.config();

export default defineConfig({
	plugins: [
		sveltekit({
			adapter:
				process.env.PUBLIC_ADAPTER === 'static'
					? adapterStatic({
							pages: 'build',
							assets: 'build',
							fallback: undefined,
							precompress: false,
							strict: false,
						})
					: process.env.PUBLIC_ADAPTER === 'cloudflare'
						? adapterCloudflare()
						: adapterVercel(),
		}),
	],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});
