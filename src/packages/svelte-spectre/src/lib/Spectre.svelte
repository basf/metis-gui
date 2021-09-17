<div class="spectre">
	<slot />
</div>

<style lang="scss">
	.spectre {
		display: contents;
		box-sizing: border-box;
		overflow-x: hidden;
		font-size: 0.8rem;
		text-rendering: optimizeLegibility;
		-ms-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		-webkit-tap-highlight-color: transparent;
	}
	.spectre :global {
		@import 'spectre.css/src/base';
		@import 'spectre.css/src/normalize';
		@import 'spectre.css/src/typography';
		@import 'spectre.css/src/layout';
		@import 'spectre.css/src/animations';
		@import 'spectre.css/src/utilities';
		@import 'spectre.css/src/media';
		@import 'spectre.css/src/badges';
	}
</style>
