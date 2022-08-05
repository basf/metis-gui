<Main>
	{#if mode !== 'light'}
		<Filter icon={add ? 'minus' : 'plus'} action={() => (add = !add)} />
	{/if}

	{#if add || !$datasources.total}
		<DataSourceAdd msg={!$datasources.total} />
	{/if}

	<div bind:clientWidth={width} class="py-2">
		<Grid stack>
			{#await $datasourcesAsync}
				{#each { length: 4 } as _}
					<Col col="12">
						<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
					</Col>
				{/each}
			{:then { data, total }}
				{#if total > $query.params.limit}
					<Col col="12">
						<Pagination
							bind:page={$query.params.page}
							limit={$query.params.limit}
							perpage={false}
							rest={5}
							{total}
						/>
					</Col>
				{/if}
				{#each data as datasource (datasource.id)}
					<Col col="12">
						<DataSource {datasource}>
							{#if $user?.id === datasource.userId}
								<TileMenu
									items={tileMenuItems(datasource.type)}
									dataId={datasource.id}
								/>
							{/if}
						</DataSource>
					</Col>
				{/each}
			{:catch error}
				<Col>
					<Overlay>Server disconnected</Overlay>
				</Col>
			{/await}
		</Grid>
	</div>
</Main>

<DataModal data={$datasources.data} />

<script lang="ts" context="module">
	import { fragment, query } from 'svelte-pathfinder';
	import { Col, Grid, Pagination } from 'svelte-spectre';

	import { Main, Overlay } from '@/layouts/';

	import { Filter } from '@/components/Filter';
	import DataSourceAdd from '@/views/DataSource/DataSourceAdd.svelte';
	import { DataSource } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import { delDataSource, setCalculation } from '@/services/api';

	import datasources, { datasourcesAsync } from '@/stores/datasources';
	import { engines } from '@/stores/calculations';
	import { withConfirm } from '@/stores/confirmator';

	import { DataModal } from '@/views/modals';

	import user from '@/stores/user';
	import { TileMenu } from '@/components/Tile/';
	import Sinus from '@/assets/img/sinus.svg';

	import { PAGE_LIMIT } from '@/config';
	import { getContext } from 'svelte';
</script>

<script lang="ts">
	let width = 0;
	let add = false;

	$query.params.limit = PAGE_LIMIT;

	const mode = getContext('mode');

	const tileMenuItems = (type: number) => {
		const editCalc = {
				icon: 'edit',
				label: 'Edit Calculation',
				action: editCalculation,
			},
			editTag = {
				icon: 'tag',
				label: 'Edit Tags',
				action: editTags,
			},
			editPlot = {
				icon: Sinus,
				label: 'Edit Plot',
				action: editPlots,
			},
			runCalc = {
				icon: 'forward',
				color: 'success',
				label: 'Calculate',
				action: runCalculation,
			},
			deleteData = {
				icon: 'cross',
				color: 'error',
				label: 'Delete',
				action: delData,
				query: $query.toString(),
			};
		return [
			type === 1 ? runCalc : null,
			type === 1 ? editCalc : null,
			editTag,
			deleteData,
		].filter(Boolean);
	};

	async function editCalculation(id: number) {
		$fragment = `#edit-calculation-${id}`;
	}

	function editTags(id: number) {
		$fragment = `#edit-tags-${id}`;
	}

	function editPlots(id: number) {
		$fragment = `#edit-plot-${id}`;
	}

	function runCalculation(id: number) {
		if ($engines) {
			$fragment = `#edit-engine-${id}`;
		} else setCalculation({ dataId: id });
	}

	function delData(id: number, query: string) {
		withConfirm(delDataSource, { id, query }, 'Are you sure?', false)?.({ id, query });
	}
</script>
