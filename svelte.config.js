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
					$dark-background: darken($dark-color, 5%);
					$dark-text: darken($light-color, 5%);
					$dark-secondary: mix($dark-color, $primary-color, 90%);
					$dark-shadow: darken($dark-background, 10%);
					$dark-border: darken($border-color, 10%);
					$dark-overlay: rgba($dark-background, 0.69);
					$dark-code: mix($dark-color, $code-color, 90%);
					$dark-highlight: darken($highlight-color, 50%);

					@include bg-color-variant(".bg-darked", $dark-background);
					@include bg-color-variant(".bg-secondary-darked", $dark-secondary);

					@include text-color-variant(".text-darked", $dark-text);
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
