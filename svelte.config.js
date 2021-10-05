const preprocess = require('svelte-preprocess');
const cssModules = require('svelte-preprocess-cssmodules');

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
		//cssModules(),
	]
};

function componentBudget({ budget = 200 } = {}) {
	return {
		markup: ({ content, filename }) => {
			const loc = content.split(/\r\n|\r|\n/).length;
			if (loc > budget) {
				console.log('\x1b[33m%s\x1b[0m', `Component ${filename} exceeded the budget: `);
				console.log('\x1b[31m%s\x1b[0m', `${loc} lines insted of ${budget}`);
			}

			return { code: content };
		},
	}
}
