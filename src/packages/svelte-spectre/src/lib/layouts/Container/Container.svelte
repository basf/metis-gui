<div class="container grid-{size} {offset} ">
	<slot />
</div>

<script context="module" lang="ts">
	import type { Size } from '../../types/size';

	type Offset = 'my-1' | 'my-2' | 'mt-1' | 'mt-2' | 'mb-1' | 'mb-2' | '';

	export type { Size, Offset };
</script>

<script lang="ts">
	export let size: Size = 'md';
	export let offset: Offset = '';
</script>

<style lang="scss">
	:global(.spectre) {
		@import url('spectre.css/src/layout');
	}
</style>
