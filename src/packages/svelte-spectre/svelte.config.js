import { preprocess } from 'svelte/compiler';
import sveltePreprocess from 'svelte-preprocess';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const options = {
	sourceMap: dev,
	scss: {
		prependData: `
			@import './node_modules/spectre.css/src/variables';
			@import './node_modules/spectre.css/src/mixins';
			@import './node_modules/spectre.css/src/icons/icons-core';
		`,
	},
	postcss: true,
	typescript: true,
};

function prodPreprocess(options) {
	return {
		markup: async ({ content, filename }) => {
			const preprocessed = await preprocess(content, [sveltePreprocess(options)], {
				filename,
			});
			const regexp = /lang="ts"|lang="scss"|(<script lang="ts" context="module"><\/script>)/g;
			const code = preprocessed.code.replaceAll(regexp, '');
			preprocessed.code = code.trim();
			return preprocessed;
		}
	}
}

/** @type {import('@sveltejs/kit').Config} */
export default {
	// https://github.com/sveltejs/svelte-preprocess
	compilerOptions: null,
	preprocess: [!dev ? prodPreprocess(options) : sveltePreprocess(options)],
	extensions: ['.svelte'],
	kit: {
		// adapter: adapterStatic({
		// 	// default options are shown
		// 	pages: 'build',
		// 	assets: 'build',
		// 	fallback: null
		// }),
		amp: false,
		appDir: '_app',
		files: {
			assets: 'static',
			hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			serviceWorker: 'src/service-worker',
			template: 'src/app.html'
		},
		floc: false,
		host: '',
		hostHeader: '',
		hydrate: true,
		package: {
			dir: 'package',
			exports: {
				include: ['**'],
				exclude: ['**/_*', 'str_to_rgb.ts'],
			},
			files: {
				include: ['**'],
				exclude: ['helpers/str_to_rgb.ts', 'types/asset.ts', 'types/asyncable.ts'],
			},
			emitTypes: true,
		},
		paths: {
			assets: '',
			base: ''
		},
		prerender: {
			crawl: true,
			enabled: true,
			entries: ['*'],
			onError: 'fail'
		},
		router: true,
		serviceWorker: {
			exclude: []
		},
		ssr: true,
		target: '',
		trailingSlash: 'never',
		vite: () => ({})
	}
};
