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
                    @import './node_modules/spectre.css/src/variables';
                    @import './node_modules/spectre.css/src/mixins';
					@import './node_modules/svelte-spectre/package/dark';
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
