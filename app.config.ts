import { version as pkgVersion } from './package.json';

const LIGHT_MODE = process.argv.includes('--light_mode');
const dev = !!process.env.ROLLUP_WATCH;
const dest = 'dist';
const src = 'src';
const assets = `${src}/assets`;
const version = `${pkgVersion}.${Date.now()}`;

const config = {
	name: 'app',
	input: LIGHT_MODE ? `${src}/light_mode.ts` : `${src}/full_mode.ts`,
	template: `${src}/index.html`,
	files: [{ src: 'src/assets/favicon.ico', dest: 'dist' }],
	externals: [],
	replace: {
		__env: JSON.stringify(dev ? 'development' : 'production'),
		__ver: JSON.stringify(version),
	},
	alias: {
		'@': `./${src}`,
		'@/*': `./${src}/*`,
	},
	extensions: ['.js', '.mjs', '.ts', '.svelte'],
	mainFields: ['browser', 'module', 'main'],
	manifest: {
		version,
	},
	sourceMap: dev,
	legacy: false,
	assets,
	dest,
	dev,
	src,
};
export default config;
