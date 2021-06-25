const dev = !!process.env.ROLLUP_WATCH;
const dest = 'dist';
const assets = 'src/assets';

module.exports = {
    name: 'app',
    input: 'src/main.ts',
    template: 'src/index.html',
    files: [
        { src: `${assets}/*`, dest, },
    ],
    externals: [
//        { type: 'js', file: '', pos: 'before',  inject: 'head', },
    ],
    replace: {
        'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
    },
    alias: {
        '@': './src',
        '@/*': './src/*'
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
    sourceMap: dev,
    legacy: true,
    assets,
    dest,
    dev,
};