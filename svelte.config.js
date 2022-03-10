const preprocess = require('svelte-preprocess');
const componentBudget = require('svelte-component-budget');

const { dev, sourceMap, legacy, replace } = require('./app.config.js');

module.exports = {
	compilerOptions: {
		immutable: true,
		legacy,
		dev
	},
	preprocess: [
		componentBudget({ budget: 250, exclude: ['node_modules'] }),
		preprocess({
			replace: Object.entries(replace),
			scss: {
				prependData: `
					$primary-color: #5755d9 !default;
					$secondary-color: lighten($primary-color, 37.5%) !default;
					$dark-color: #303742 !default;
					$gray-color: lighten($dark-color, 55%) !default;
					$gray-color-dark: darken($gray-color, 30%) !default;
					$gray-color-light: lighten($gray-color, 20%) !default;
					$highlight-color: #ffe9b3 !default;
					$dark-secondary: #343a51;
                `,
				quietDeps: true, // dismiss version 2.0 warning
				renderSync: true // improve perfomance
			},
			typescript: true,
			postcss: true,
			sourceMap,
		}),
	]
};
