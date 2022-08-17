<div class="tile-data">
	<Tile>
		<svelte:fragment slot="icon">
			{#if datasource.type === 1}
				<Icon size="2x" color="gray">{@html Cube}</Icon>
			{:else}
				<span class="placeholder" />
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="title">
			<h5 class="mt-2">{@html datasource.name}</h5>
		</svelte:fragment>
		<svelte:fragment slot="subtitle">
			<small class="text-gray">
				Added {showTimestamp(datasource)}
			</small>
		</svelte:fragment>
		<svelte:fragment slot="action">
			<slot />
		</svelte:fragment>
	</Tile>
</div>

<script lang="ts" context="module">
	import { Icon, Tile } from 'svelte-spectre';
	import { showTimestamp } from '@/helpers/date';
	import Cube from '@/assets/img/cube.svg';

	import type { DataSource } from '@/types/dto';
</script>

<script lang="ts">
	export let datasource: DataSource;
</script>

<style lang="scss">
	.tile-data {
		:global(.tile) {
			padding: 0.25em;
		}
		h5 {
			display: inline;
		}
	}
	span.placeholder {
		display: inline-block;
		width: 32px;
	}
</style>
