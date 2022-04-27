<div class="tile-datasource">
	<Tile>
		<svelte:fragment slot="title">
			<h5 class="mt-2">{@html datasource.name}</h5>
			<ul class="collections">
				{#each getCollectionsList(datasource.id) as collection (collection.id)}
					{@const href =
						$user?.id === collection.userId
							? `/collections#${collection.id}`
							: undefined}
					<li>
						<a {href}>
							<Badge style="background: {collection.typeColor}"
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
		<svelte:fragment slot="action">
			{#if $user.id === datasource.userId}
				<TileMenu
					data={datasources}
					items={tileMenuItems}
					dataId={datasource.id}
					on:editCalculation
					on:editTags
					on:editGraphic
					on:setCalculation
					on:delDatasource
				/>
			{/if}
		</svelte:fragment>
	</Tile>
</div>

<script lang="ts" context="module">
	import { Badge, Tile } from 'svelte-spectre';
	import { TileMenu } from '@/components/Tile/';

	import user from '@/stores/user';
	import collections from '@/stores/collections';
	import { showTimestamp } from '@/helpers/date';

	import Sinus from '@/assets/img/sinus.svg';
</script>

<script>
	export let datasource, datasources;

	const tileMenuItems = [
		{
			icon: 'edit',
			label: 'Edit Calculation',
			event: { name: 'editCalculation' },
		},
		{ icon: 'tag', label: 'Edit Tags', event: { name: 'editTags' } },
		{
			icon: Sinus,
			label: 'Edit Graphic',
			event: { name: 'editGraphic' },
		},
		{
			icon: 'forward',
			color: 'success',
			label: 'Calculate',
			event: { name: 'setCalculation' },
		},
		{
			icon: 'cross',
			color: 'error',
			label: 'Delete',
			event: { name: 'delDatasource' },
		},
	];

	$: getCollectionsList = (dataSourceId) =>
		$collections.filter(({ dataSources }) => dataSources && dataSources.includes(dataSourceId));
</script>

<style lang="scss">
	:global(.spectre .tile) {
		padding: 0.75em;
		margin: 0.5em 0;
		:global(.tile-action) {
			display: flex;
		}
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
</style>
