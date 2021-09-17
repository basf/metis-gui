import preprocess from 'svelte-preprocess';

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
	replace: !dev ? [[/ lang=("|')(.*?)("|')/g, '']] : [],
};

/** @type {import('@sveltejs/kit').Config} */
export default {
	// https://github.com/sveltejs/svelte-preprocess
	compilerOptions: null,
	preprocess: [preprocess(options)],
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
			template: 'src/app.html',
		},
		floc: false,
		host: '',
		hostHeader: '',
		hydrate: true,
		package: {
			dir: 'package',
			exports: {
				include: ['**'],
				exclude: ['**/_*', 'spectre.scss'],
			},
			files: {
				include: ['**'],
				exclude: ['spectre.scss'],
			},
			emitTypes: true,
		},
		paths: {
			assets: '',
			base: '',
		},
		prerender: {
			crawl: true,
			enabled: true,
			entries: ['*'],
			onError: 'fail',
		},
		router: true,
		serviceWorker: {
			exclude: [],
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
			],
		}),
	},
};
