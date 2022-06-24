<Main>
	<DataSearch add bind:addOpen data={$datasources.length} />
	<div bind:clientWidth={width}>
		{#await $datasourcesAsync}
			{#each { length: 4 } as _}
				<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
			{/each}
		{:then datasources}
			{#if addOpen || !datasources.length}
				<DataSourceAdd msg={!datasources.length} />
			{/if}
			{#each makeDataSourcesList(datasources, search) as datasource (datasource.id)}
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

	import { DataSearch } from '@/components/Search';
	import DataSourceAdd from '@/views/DataSource/DataSourceAdd.svelte';
	import { DataSource } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import { delDataSource, setCalculation } from '@/services/api';

	import datasources, { datasourcesAsync } from '@/stores/datasources';
	import { withConfirm } from '@/stores/confirmator';

	import { CalculationEdit, PlotEdit, TagsEdit } from '@/views/modals';
	import { patchDataSourceCollections } from '@/services/api';

	import user from '@/stores/user';
	import { TileMenu } from '@/components/Tile/';
	import Sinus from '@/assets/img/sinus.svg';

	import { editorCode } from '@/stores/editor';

	import type { DataSource as DataSourceDTO } from '@/types/dto';
	import App from '@/App.svelte';
</script>

<script lang="ts">
	let width = 0;
	let search = '';
	let addOpen = false;
	let tags = [];

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
		return [editCalc, editTag, type === 1 ? runCalc : null, deleteData].filter(Boolean);
	};

	function makeDataSourcesList(items: DataSourceDTO[], search: string) {
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
