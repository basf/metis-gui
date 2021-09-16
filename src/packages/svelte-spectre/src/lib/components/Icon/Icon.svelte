<i class="icon icon-{size} {icon}" {...$$restProps} />

<script lang="ts" context="module">
	import type { Zoom } from '../../types/size';
	export type { Zoom };
</script>

<script lang="ts">
	export let icon: string = '';
	export let size: Zoom = '1x';
</script>

<style lang="scss">
	// :global {
	@import 'spectre.css/src/icons/icons-core';
	// }
	@import 'spectre.css/src/icons/icons-navigation';
	@import 'spectre.css/src/icons/icons-action';
	@import 'spectre.css/src/icons/icons-object';

	// // missed global class
	// :global(.accordion, .btn, menu, .toast) :where(.icon) {
	// 	vertical-align: -10%;
	// }
</style>
