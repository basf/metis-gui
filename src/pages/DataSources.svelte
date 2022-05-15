<Main>
	<TabSearch add bind:value={search} bind:addOpen data={$datasources} />

	<div bind:clientWidth={width}>
		{#await $datasourcesAsync}
			{#each { length: 4 } as _}
				<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
			{/each}
		{:then datasources}
			{#if addOpen || !datasources.length}
				{#if !datasources.length}
					<div class="text-center distant_msg">Upload a structure to start...</div>
				{/if}
				<div class="py-2">
					<DataSourceAdd />
				</div>
			{/if}
			{#each makeDataList(datasources, search) as datasource (datasource.id)}
				<Data {datasource}>
					{#if $user?.id === datasource.userId}
						<TileMenu items={tileMenuItems} dataId={datasource.id} />
					{/if}
				</Data>
			{/each}
		{/await}
	</div>
</Main>

<Modal size={$media.sm ? 'fs' : 'lg'} open={!!$fragment} on:close={closeModal}>
	<h3 slot="header">
		{@html `Edit and submit ${decodeURIComponent(dataType)} for <mark> ${
			$datasources.find((d) => d.id === +dataId)?.name
		} </mark>`}
	</h3>
	{#if modal().component}
		<svelte:component
			this={modal().component}
			dataSourceId={+decodeURIComponent(dataId)}
			bind:tags
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
	import { fragment } from 'svelte-pathfinder';
	import { Button, Modal, toast } from 'svelte-spectre';
	import { media } from '@/stores/media';

	import Main from '@/layouts/Main.svelte';

	import { TabSearch, match } from '@/components/Search';
	import DataSourceAdd from '@/views/DataSource/DataSourceAdd.svelte';
	import { Data } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import { delData, setCalculation } from '@/services/api';

	import datasources, { datasourcesAsync } from '@/stores/datasources';
	import { withConfirm } from '@/stores/confirmator';

	import { CalculationEdit, PlotEdit, TagsEdit } from '@/views/modals';
	import { patchDataSourceCollections } from '@/services/api';

	import user from '@/stores/user';
	import { TileMenu } from '@/components/Tile/';
	import Sinus from '@/assets/img/sinus.svg';

	import { editorCode } from '@/stores/editor';

	import type { DataSource } from '@/types/dto';
</script>

<script lang="ts">
	let width = 0;
	let search = '';
	let addOpen = false;
	let tags = [];

	const tileMenuItems = [
		{
			icon: 'edit',
			label: 'Edit Calculation',
			action: editCalculation,
		},
		{
			icon: 'tag',
			label: 'Edit Tags',
			action: editTags
		},
		/*{
			icon: Sinus,
			label: 'Edit Plot',
			action: editPlot,
		},*/
		{
			icon: 'forward',
			color: 'success',
			label: 'Calculate',
			action: runCalculation,
		},
		{
			icon: 'cross',
			color: 'error',
			label: 'Delete',
			action: delDatasource,
		},
	];

	function makeDataList(items: DataSource[], search: string) {
		return search
			? items.filter((item) => match(item, search))
			: items.sort((a, b) => b.id - a.id);
	}

	function closeModal() {
		$fragment = '';
	}

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
					submit: submitPlot,
				};
			default:
				return {
					component: undefined,
					submit: () => {},
				};
		}
	};

	$: [_, dataType, dataId] = $fragment.split('-');

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
		await patchDataSourceCollections(+dataId, tags).then(() => closeModal());
	}

	function editPlot(id: number) {
		$fragment = `#edit-plot-${id}`;
	}
	function submitPlot() {
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

	function delDatasource(id: number) {
		withConfirm(delData, id, 'Are you sure?', false)?.(id);
	}
</script>
