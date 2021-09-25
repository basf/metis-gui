<div class="container grid-{size} {offset}" use:addClass={classes}>
	<slot />
</div>

<script context="module" lang="ts">
	import { addClass } from '../../helpers/actions';
	import type { Size } from '../../types/size';
	import type { Offset } from '../../types/position';

	export type { Size, Offset };
</script>

<script lang="ts">
	export let size: Size = 'md';
	export let offset: Offset = '';
	export let classes: string[] = [];
</script>

<style lang="scss">
	:global(.spectre) {
		@import url('spectre.css/src/layout');
	}
</style>
