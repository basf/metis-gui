<Main>
	<TabSearch add bind:value={search} bind:addOpen data={$datasources} />

	<div bind:clientWidth={width}>
		{#await $datasourcesAsync}
			{#each { length: 4 } as _}
				<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
			{/each}
		{:then datasources}
			{#if addOpen || !datasources}
				{#if !datasources}
					<div class="text-center distant_msg">Upload a structure to start...</div>
				{/if}
				<div class="py-2">
					<DataSourceAdd value={search} />
				</div>
			{/if}
			{#each makeDataList(datasources, search) as datasource (datasource.id)}
				<Data
					{datasource}
					{datasources}
					on:editCalculation={() => calculation.edit(datasource)}
					on:editTags={() => tag.edit(datasource)}
					on:editGraphic={() => graphic.edit(datasource)}
					on:setCalculation={() => calculation.run(datasource.id)}
					on:delDatasource={() =>
						withConfirm(
							delData,
							datasource.id,
							'Are you sure?',
							false
						)?.(datasource.id)}
				/>
			{/each}
		{/await}
	</div>
</Main>

<Modal size="lg" open={!!$fragment} on:close={closeModal}>
	<h3 slot="header">
		{@html `Edit and submit ${decodeURIComponent(dataType)} for <mark> ${
			$datasources.find((d) => d.id === +dataId)?.name
		} </mark>`}
	</h3>
	{#if modalComponent}
		<svelte:component
			this={modalComponent}
			dataSourceId={+decodeURIComponent(dataId)}
			bind:tags
		/>
	{:else}
		<span style="height: 100%" class="loading loading-lg p-centered d-block" />
	{/if}
	<svelte:fragment slot="footer">
		<Button on:click={closeModal}>Cancel</Button>
		<Button variant="primary" on:click={$EditorCode.input ? calculation.submit : tag.submit}
			>Submit</Button
		>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { fragment } from 'svelte-pathfinder';
	import { Button, Modal, toast } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';

	import { TabSearch, match } from '@/components/Search';
	import DataSourceAdd from '@/views/DataSource/DataSourceAdd.svelte';
	import { Data } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import { delData, setCalculation, HttpError } from '@/services/api';

	import datasources, { datasourcesAsync } from '@/stores/datasources';
	import { withConfirm } from '@/stores/confirmator';

	import { CalculationEdit, GraphicEdit, TagsEdit } from '@/views/modals';
	import { setCollection } from '@/services/api';

	import { EditorCode } from '@/stores/editor';

	import type { Collection, DataSource } from '@/types/dto';
</script>

<script lang="ts">
	let width = 0;
	let search = '';
	let addOpen = false;
	let dataSourceId = 0;
	let tags = [];

	function makeDataList(items: DataSource[], search: string) {
		return search
			? items.filter((item) => match(item, search))
			: items.sort((a, b) => b.id - a.id);
	}

	function closeModal() {
		$fragment = '';
	}

	$: modalComponent = $fragment.includes('calculation')
		? CalculationEdit
		: $fragment.includes('tags')
		? TagsEdit
		: $fragment.includes('graphic')
		? GraphicEdit
		: undefined;

	$: [_, dataType, dataId] = $fragment.split('-');

	const calculation = {
		edit: async (datasource: DataSource) => {
			dataSourceId = datasource.id;
			$fragment = `#edit-calculation-${datasource.id}`;
		},
		submit: () =>
			setCalculation(dataSourceId, 'dummy', $EditorCode.input).then(() => closeModal()),
		run: (id: number) => {
			setCalculation(id);
			toast.success({
				msg: 'Calculation in progress',
				timeout: 2000,
				pos: 'top_right',
				icon: 'forward',
			});
		},
	};

	const tag = {
		edit: (datasource: DataSource) => {
			dataSourceId = datasource.id;
			$fragment = `#edit-tags-${datasource.id}`;
		},
		submit: async () => {
			const promises = tags.map((collection) => saveCollection(collection));
			try {
				await Promise.all(promises);
			} catch (e) {
				console.error(e);
			} finally {
				closeModal();
			}

			async function saveCollection(value: Collection) {
				try {
					await setCollection(value);
				} catch (err: unknown) {
					toast.error({
						msg: (err as HttpError).message,
						timeout: 2000,
						pos: 'top_right',
					});
				}
			}
		},
	};

	const graphic = {
		edit: (datasource: DataSource) => {
			dataSourceId = datasource.id;
			$fragment = `#edit-graphic-${datasource.id}`;
		},
		submit: () => closeModal(),
	};
</script>
