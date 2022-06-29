<div class="tile-data">
	<Tile>
		<svelte:fragment slot="title">
			<h5 class="mt-2">{@html datasource.name}</h5>
			<ul class="collections">
				{#each getCollectionsList(datasource.id) as collection (collection.id)}
					<li>
						<a href={filterLink(collection.id)}>
							<Badge style="background: {collection.typeFlavor}"
								>{collection.title.substring(0, 10)}</Badge
							>
						</a>
					</li>
				{/each}
			</ul>
		</svelte:fragment>
		<svelte:fragment slot="subtitle">
			<small class="text-gray">
				Type &bull; {datasource.type} &bull; {showTimestamp(datasource)}
			</small>
		</svelte:fragment>
		{#if datasource.progress}
			<Meter value={datasource.progress} />
		{/if}
		<svelte:fragment slot="action">
			<slot />
		</svelte:fragment>
	</Tile>
</div>

<script lang="ts" context="module">
	import { query } from 'svelte-pathfinder';
	import { Badge, Meter, Tile } from 'svelte-spectre';
	import collections from '@/stores/collections';
	import { showTimestamp } from '@/helpers/date';

	import type { Collection, DataSource } from '@/types/dto';
</script>

<script lang="ts">
	export let datasource: DataSource;

	$: getCollectionsList = (dataSourceId: number): Collection[] =>
		$collections.filter(
			({ dataSources }: { dataSources: number[] }): boolean =>
				dataSources && dataSources.includes(dataSourceId)
		);

	function filterLink(id: number) {
		const iDs: number[] = `${$query.params.collectionIds}`
			.split(',')
			.map((c) => +c)
			.filter(Boolean);
		const collectionIds = new Set([...iDs, id]);
		return `?collectionIds=${Array.from(collectionIds)}`;
	}
</script>

<style lang="scss">
	.tile-data {
		margin: 0.5em 0;
		:global(.tile) {
			padding: 0.5em;
		}
		h5 {
			display: inline;
		}
		.collections {
			list-style: none;
			margin: 0;
			padding: 0;
			display: inline-flex;
			flex-flow: row wrap;
			gap: 0.25em;
			float: right;
			li {
				margin: 0;
				padding: 0;
			}
		}
	}
</style>
