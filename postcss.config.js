const { dev, sourceMap: map } = require('./app.config.js');

module.exports = {
	plugins: [
		require('postcss-url')(),
		require('postcss-import')(),
		require('postcss-preset-env')(),
		require('postcss-flexbugs-fixes')(),
		!dev && require('autoprefixer')(),
	],
	map,
};
