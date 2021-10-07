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
		componentBudget({ budget: 250 }),
		preprocess({
			replace: Object.entries(replace),
			scss: {
				prependData: `
                    @import './node_modules/spectre.css/src/variables';
                    @import './node_modules/spectre.css/src/mixins';
                `,
            },
            typescript: true,
            postcss: true,
            sourceMap,
        }),
    ]
};
