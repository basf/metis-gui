<Main>
	<Filter icon={add ? 'minus' : 'plus'} action={() => (add = !add)} />
	<Pagination
		bind:limit={$query.params.limit}
		bind:page={$query.params.page}
		limits={[5, 10, 50, 100]}
		total={$datasources?.total || 10}
		rest={7}
	/>

	<div bind:clientWidth={width}>
		{#if !$datasources?.total}
			{#each { length: 4 } as _}
				<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
			{/each}
		{:else}
			{@const { data, total } = $datasources}
			{#if add || !total}
				<DataSourceAdd msg={!total} />
			{/if}
			{#each data as datasource (datasource.id)}
				<DataSource {datasource}>
					{#if $user?.id === datasource.userId}
						<TileMenu items={tileMenuItems(datasource.type)} dataId={datasource.id} />
					{/if}
				</DataSource>
			{/each}
			<DataModal {data} />
		{/if}
	</div>
</Main>

<script lang="ts" context="module">
	import { fragment, query } from 'svelte-pathfinder';
	import { Pagination, toast } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';

	import { Filter } from '@/components/Filter';
	import DataSourceAdd from '@/views/DataSource/DataSourceAdd.svelte';
	import { DataSource } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import { delDataSource, getCollections, setCalculation } from '@/services/api';

	import { datasources } from '@/stores/datasources';
	import { withConfirm } from '@/stores/confirmator';

	import { DataModal } from '@/views/modals';

	import user from '@/stores/user';
	import { TileMenu } from '@/components/Tile/';
	import Sinus from '@/assets/img/sinus.svg';
	import { onMount } from 'svelte';
</script>

<script lang="ts">
	let width = 0,
		add = false;

	// onMount(getCollections);

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
			};
		return [type === 1 ? runCalc : null, editCalc, editTag, deleteData].filter(Boolean);
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
		setCalculation(id).then(() => {
			toast.success({
				msg: 'Calculation submitted',
				timeout: 2000,
				pos: 'top_right',
				icon: 'forward',
			});
		});
	}

	function delData(id: number) {
		withConfirm(delDataSource, id, 'Are you sure?', false)?.(id);
	}
</script>
