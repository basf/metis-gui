{#if container}
	<Container {size}>
		<div
			class="columns {$$props.class || ''}"
			class:col-gapless={gapless}
			class:col-oneline={oneline}
			class:stack
		>
			<slot />
		</div>
	</Container>
{:else}
	<div
		class="columns {$$props.class || ''}"
		class:col-gapless={gapless}
		class:col-oneline={oneline}
		class:stack
	>
		<slot />
	</div>
{/if}

<script lang="ts" context="module">
	import { Container } from '../Container/';

	import type { Size } from '../Container/';

	export type { Size };
</script>

<script lang="ts">
	export let size: Size = 'md';
	export let gapless: boolean = false;
	export let oneline: boolean = false;
	export let container: boolean = false;
	export let stack: boolean = false;
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
</style>
