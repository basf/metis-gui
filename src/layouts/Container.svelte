<div class="container grid-{size}">
	<slot />
</div>

<script context="module">
	import type { Size } from '@/types/size';
	export type { Size };
</script>

<script>
	export let size: Size = 'md';
</script>
