<i class="icon icon-{size} icon-{icon}" {...$$restProps} />

<script lang="ts" context="module">
	import type { Zoom } from '../../types/size';
	export type { Zoom };
</script>

<script lang="ts">
	export let icon: string = '';
	export let size: Zoom = '1x';
</script>

<style lang="scss">
	@import 'spectre.css/src/icons';
	:global {
		@import 'spectre.css/src/icons/icons-core';
	}
</style>
