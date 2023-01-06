import postcssUrl from 'postcss-url';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import autoprefixer from 'autoprefixer';
import app from './app.config';
const { dev, sourceMap: map } = app;

export default {
	plugins: [
		postcssUrl(),
		postcssImport(),
		postcssPresetEnv(),
		postcssFlexbugsFixes(),
		!dev && autoprefixer(),
	].filter((f) => f),
	map,
};
