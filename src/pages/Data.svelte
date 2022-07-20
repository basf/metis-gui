<Main>
	<Filter icon={add ? 'minus' : 'plus'} action={() => (add = !add)} />
	<div bind:clientWidth={width}>
		{#await $datasourcesAsync}
			{#each { length: 4 } as _}
				<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
			{/each}
		{:then { data, total }}
			{#if add || !data.length}
				<DataSourceAdd msg={!data.length} />
			{/if}
			{#if total}
				<Pagination
					bind:limit={$query.params.limit}
					bind:page={$query.params.page}
					limits={[10, 50, 100]}
					{total}
					rest={7}
				/>
			{/if}
			{#each data as datasource (datasource.id)}
				<DataSource {datasource}>
					{#if $user?.id === datasource.userId}
						<TileMenu items={tileMenuItems(datasource.type)} dataId={datasource.id} />
					{/if}
				</DataSource>
			{/each}
		{/await}
	</div>
</Main>

<Modal size={$media.sm ? 'fs' : 'lg'} open={!!$fragment} on:close={closeModal}>
	<h3 slot="header">
		{@const modalHeader = `Edit and submit ${decodeURIComponent(dataType)} for <mark> ${
			$datasources?.data?.find((data) => data.id === +dataId)?.name
		} </mark>`}
		{@html modalHeader}
	</h3>
	{#if modal().component}
		<svelte:component
			this={modal().component}
			dataSourceId={+decodeURIComponent(dataId)}
			bind:tags={tagIds}
		/>
	{:else}
		<span style="height: 100%" class="loading loading-lg p-centered d-block" />
	{/if}
	<svelte:fragment slot="footer">
		<Button on:click={closeModal}>Cancel</Button>
		<Button variant="primary" on:click={modal().submit}>Submit</Button>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { fragment, query } from 'svelte-pathfinder';
	import { Button, Modal, Pagination, toast } from 'svelte-spectre';
	import { media } from '@/stores/media';

	import Main from '@/layouts/Main.svelte';

	import { Filter } from '@/components/Filter';
	import DataSourceAdd from '@/views/DataSource/DataSourceAdd.svelte';
	import { DataSource } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import { delDataSource, getCollections, setCalculation } from '@/services/api';

	import data, { datasources, datasourcesAsync } from '@/stores/datasources';
	import { withConfirm } from '@/stores/confirmator';

	import { CalculationEdit, PlotEdit, TagsEdit } from '@/views/modals';
	import { getDataSources, patchDataSourceCollections } from '@/services/api';

	import user from '@/stores/user';
	import { TileMenu } from '@/components/Tile/';
	import Sinus from '@/assets/img/sinus.svg';

	import { editorCode } from '@/stores/editor';
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let width = 0,
		add = false,
		tagIds = [];

	onMount(() => {
		$query.params.page ??= 1;
		$query.params.limit ??= 10;
		// getDataSources($query);
		getCollections($query);
	});

	$: console.log($datasources);
	// $: if ($query.params.page && $query.params.limit) getDataSources($query);

	$: modal = () => {
		switch (dataType) {
			case 'calculation':
				return {
					component: CalculationEdit,
					submit: submitCalculation,
				};
			case 'tags':
				return {
					component: TagsEdit,
					submit: submitTags,
				};
			case 'plot':
				return {
					component: PlotEdit,
					submit: submitPlots,
				};
			default:
				return {
					component: undefined,
					submit: () => {},
				};
		}
	};

	$: [_, dataType, dataId] = $fragment.split('-');

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

	function closeModal() {
		$fragment = '';
	}

	async function editCalculation(id: number) {
		$fragment = `#edit-calculation-${id}`;
	}
	function submitCalculation() {
		setCalculation(+dataId, 'dummy', $editorCode.input).then(() => closeModal());
	}

	function editTags(id: number) {
		$fragment = `#edit-tags-${id}`;
	}
	async function submitTags() {
		await patchDataSourceCollections(+dataId, tagIds).then(() => closeModal());
	}

	function editPlots(id: number) {
		$fragment = `#edit-plot-${id}`;
	}
	function submitPlots() {
		closeModal();
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
