import { preprocess } from 'svelte/compiler';
import sveltePreprocess from 'svelte-preprocess';
// import sassPlugin from 'esbuild-plugin-sass'
// import { resolve } from "path"
// import postcss from 'postcss';
// import sass from 'sass';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const options = {
	sourceMap: dev,
	defaults: {
		script: 'typescript',
		style: 'scss',
	},
	scss: {
		prependData: `
			@import './node_modules/spectre.css/src/variables';
			@import './node_modules/spectre.css/src/mixins';
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
	compilerOptions: {
		// cssHash: () => ({ name: 'spectre' })
	},
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
				exclude: ['**/_*', 'str_to_rgb.ts', 'spectre.scss'],
			},
			files: {
				include: ['**'],
				exclude: ['helpers/str_to_rgb.ts', 'types/asset.ts', 'types/asyncable.ts', 'spectre.scss'],
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
		vite: () => ({
			server: { port: 3030 },
			css: {
				preprocessorOptions: {
					scss: {
						// example : additionalData: `@import "./src/design/styles/variables";`
						// dont need include file extend .scss
						// additionalData: `@import "./src/lib/spectre.scss";`
					},
				},
			},
			plugins: [
				// postcss({
				// 	include: "./src/lib/spectre.scss",
				// 	extract: resolve('package/spectre.css')
				// }),
				// sassPlugin(),
			]
		})
	}
};
