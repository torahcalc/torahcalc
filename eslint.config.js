import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.es2017,
				...globals.node,
			},
		},
		rules: {
			'svelte/no-navigation-without-resolve': 'off',
		},
	},
	{
		ignores: [
			'.DS_Store',
			'node_modules',
			'build',
			'.svelte-kit',
			'package',
			'*.local',
			'.vercel',
			'.output',
			'vite.config.js.timestamp-*',
			'vite.config.ts.timestamp-*',
			'android',
			'ios',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock',
		],
	},
];
