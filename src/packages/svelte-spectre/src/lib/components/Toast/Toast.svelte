<div class="toast toast-{type}">
	{#if closable}
		<Button variant="clear" class="float-right c-hand" />
	{/if}
	<slot>Default text</slot>
</div>

<script context="module" lang="ts">
	import { Button } from '../Button';

	import type { Color } from '../../types/bg';
	export type { Color };
</script>

<script lang="ts">
	export let closable = false;
	export let type: Color = 'initial';
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/toasts';
	}
</style>
