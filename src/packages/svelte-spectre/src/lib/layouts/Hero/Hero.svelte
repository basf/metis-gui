<div class="hero hero-{size} bg-{bg} {$$props.class}">
	<div class="hero-body">
		<slot>
			<h1>Hero title</h1>
			<p>This is a hero example</p>
		</slot>
	</div>
</div>

<script lang="ts" context="module">
	import type { Size } from '../../types/size';
	import type { Color } from '../../types/bg';

	export type { Size, Color };
</script>

<script lang="ts">
	export let size: Size = 'sm';
	export let bg: Color = 'gray';
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/hero';
	}
</style>
