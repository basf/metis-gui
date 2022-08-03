<div class="tile-data">
	<Tile>
		<svelte:fragment slot="icon">
			{#if datasource.type === 1}
				<Icon size="2x" color="gray">{@html Cube}</Icon>
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="title">
			<h5 class="mt-2">{@html datasource.name}</h5>
			<ul class="collections">
				{#each getCollectionsList(datasource.id, $filters.data) as tag (tag.id)}
					<li>
						<a href={setTagLink(tag)}>
							<Badge style="background: {tag.typeFlavor}">
								{tag.title}
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
		<svelte:fragment slot="action">
			<slot />
		</svelte:fragment>
	</Tile>
</div>

<script lang="ts" context="module">
	import { query, path } from 'svelte-pathfinder';
	import { Avatar, Badge, Icon, Tile } from 'svelte-spectre';
	import { showTimestamp } from '@/helpers/date';
	import Cube from '@/assets/img/cube.svg';

	import filters from '@/stores/filters';

	import type { DataSource, Collection } from '@/types/dto';
</script>

<script lang="ts">
	export let datasource: DataSource;

	let dataUserName = `${datasource.userFirstName} ${datasource.userLastName}`;

	function getCollectionsList(datasourceId: number, data: Collection[]) {
		return data.filter((filter) => filter.dataSources?.includes(datasourceId));
	}

	function setTagLink({ id, typeId, visibility }: Partial<Collection>) {
		const iDs = `${$query.params.collectionIds}`
			.split(',')
			.map((c) => +c)
			.filter(Boolean);

		const collectionIds = new Set([...iDs, id]);

		return (
			$path +
			`?page=1&limit=${$query.params.limit}&type=${$query.params.type}&visibility=${
				$query.params.visibility
			}&collectionIds=${Array.from(collectionIds)}`
		);
	}
</script>

<style lang="scss">
	.tile-data {
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
