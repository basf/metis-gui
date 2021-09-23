<div
	class="columns grid-align-{align} {$$props.class || ''}"
	class:col-gapless={gapless}
	class:col-oneline={oneline}
	class:stack
	class:stretch
>
	<slot />
</div>

<script lang="ts" context="module">
	type Align = 'start' | 'center' | 'end' | 'stretch';

	import type { Size } from '../Container/';
	export type { Size };
</script>

<script lang="ts">
	export let size: Size = 'md';
	export let gapless: boolean = false;
	export let oneline: boolean = false;
	export let stack: boolean = false;
	export let stretch: boolean = false;
	export let align: Align = 'start';
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/layout';
	}
	.stack {
		margin-top: $layout-spacing * -2;
		& > :global(*) {
			margin-top: $layout-spacing * 2;
		}
	}
	.stretch {
		& > :global(* > *) {
			height: 100%;
		}
	}
	.grid-align-start {
		align-items: flex-start;
	}
	.grid-align-center {
		align-items: center;
	}
	.grid-align-end {
		align-items: flex-end;
	}
	.grid-align-stretch {
		& > :global(* > *) {
			height: 100%;
		}
	}
</style>
