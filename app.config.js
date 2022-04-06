const { version: pkgVersion } = require('./package.json');

const dev = !!process.env.ROLLUP_WATCH;
const dest = 'dist';
const src = 'src';
const assets = `${src}/assets`;
const version = `${pkgVersion}.${Date.now()}`;

module.exports = {
    name: 'app',
    input: `${src}/main.ts`,
    template: `${src}/index.html`,
    files: [],
    externals: [],
    replace: {
        __env: JSON.stringify(dev ? 'development' : 'production'),
        __ver: JSON.stringify(version),
    },
    alias: {
        '@': `./${src}`,
        '@/*': `./${src}/*`
    },
    extensions: [
        '.js',
        '.mjs',
        '.ts',
        '.svelte',
    ],
    mainFields: [
        'browser',
        'module',
        'main'
    ],
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