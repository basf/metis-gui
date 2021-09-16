<div class="spectre">
	<slot />
</div>

<style lang="scss">
	:global {
		@import 'spectre.css/src/base';
		@import 'spectre.css/src/normalize';
	}
	.spectre {
		display: contents;
	}
	.spectre :global {
		@import 'spectre.css/src/typography';
		@import 'spectre.css/src/layout';
		@import 'spectre.css/src/animations';
		@import 'spectre.css/src/utilities';
		@import 'spectre.css/src/media';
	}
</style>
