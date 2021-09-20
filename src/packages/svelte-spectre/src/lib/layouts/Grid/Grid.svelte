{#if container}
	<div class="container">
		<div
			class="columns {$$props.class || ''}"
			class:col-gapless={gapless}
			class:col-oneline={oneline}
		>
			<slot />
		</div>
	</div>
{:else}
	<div
		class="columns {$$props.class || ''}"
		class:col-gapless={gapless}
		class:col-oneline={oneline}
	>
		<slot />
	</div>
{/if}

<script lang="ts" context="module">
	import type { Size } from '../../types/size';
	import type { Color } from '../../types/bg';

	export type { Size, Color };
</script>

<script lang="ts">
	export let size: Size = 'sm';
	export let bg: Color = 'gray';
	export let gapless: boolean = false;
	export let oneline: boolean = false;
	export let container: boolean = false;
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/layout';
	}
</style>
