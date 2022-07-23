<div class="tile-data">
	<Tile>
		<svelte:fragment slot="title">
			<h5 class="mt-2">{@html datasource.name}</h5>
			<ul class="collections">
				{#each datasource.collections as collection (collection.id)}
					<li>
						<a href={setCollectionLink(collection.id)}>
							<Badge style="background: {collection.typeFlavor}">
								{collection.title}
							</Badge>
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
	import { showTimestamp } from '@/helpers/date';

	import type { DataSource } from '@/types/dto';
</script>

<script lang="ts">
	export let datasource: DataSource;

	function setCollectionLink(id: number) {
		const iDs: number[] = `${$query.params.collectionIds}`
			.split(',')
			.map((c) => +c)
			.filter(Boolean);
		const collectionIds = new Set([...iDs, id]);

		return `/datasources?collectionIds=${Array.from(collectionIds)}&limit=${
			$query.params.limit
		}&page=1&type=${$query.params.type}&visibility=${$query.params.visibility}`;
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
