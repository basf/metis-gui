<div class="tile-data">
	<Tile>
		<svelte:fragment slot="icon">
			{#if datasource.type === 1}
				<IconButton tooltip="View details" icon="more-horiz" on:click={() => visData(datasource.id)} />
			{:else}
				<span class="placeholder" />
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="title">
			<h5 class="mt-2">{@html datasource.name}</h5>
		</svelte:fragment>
		<svelte:fragment slot="subtitle">
			<small class="text-gray">
				{#if $user.roleSlug == 'admin'}
					{showTimestamp(datasource)} by {datasource.userFirstName}
				{:else}
					Added {showTimestamp(datasource)}
				{/if}
			</small>
		</svelte:fragment>
		<svelte:fragment slot="action">
			<slot />
		</svelte:fragment>
	</Tile>
</div>

<script lang="ts" context="module">
	import { fragment } from 'svelte-pathfinder';
	import { IconButton, Tile } from 'svelte-spectre';
	import user from '@/stores/user';
	import { showTimestamp } from '@/helpers/date';
	import Cube from '@/assets/img/cube.svg';

	import type { DataSource } from '@/types/dto';
</script>

<script lang="ts">
	export let datasource: DataSource;

	function visData(id: number) {
		$fragment = `#view-vis-${id}`;
	}
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
