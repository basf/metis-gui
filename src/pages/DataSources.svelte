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
					<DataSourceAdd
						{contents}
						bind:clearFiles
						bind:value={content}
						on:files={handleFiles}
						on:click={addDataItem}
					/>
				</div>
			{/if}
			{#each makeDataList(datasources, search) as datasource (datasource.id)}
				<DataSource
					{datasource}
					{datasources}
					on:editCalculation={(e) => editCalculation(datasource, e)}
					on:editTags={(e) => editTags(datasource, e)}
					on:editGraphic={(e) => editGraphic(datasource, e)}
					on:setCalculation={() => calculate(datasource.id)}
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

<Modal bind:open={modal.open} size="lg">
	<h3 slot="header">{@html modal.header}</h3>
	{#if modal.component}
		<svelte:component
			this={modal.component}
			source={pointsSource}
			bind:code={editor.template}
			on:change={setInput}
			{datasourceID}
			bind:tags
		/>
	{:else}
		<span style="height: 100%" class="loading loading-lg p-centered d-block" />
	{/if}
	<svelte:fragment slot="footer">
		<Button on:click={() => (modal = {})}>Cancel</Button>
		<Button variant="primary" on:click={editor.template ? submitCalculation : submitTags}
			>Submit</Button
		>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { query, fragment } from 'svelte-pathfinder';
	import { Button, Modal, Tile, Badge, toast } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';
	import { Editor } from '@/components/Editor/';
	import { Graphic } from '@/components/Graphic/';
	import pointsSource from '@/components/Graphic/points';
	import { TileMenu } from '@/components/Tile/';
	import { TabSearch, match } from '@/components/Search';
	import DataSourceAdd from '@/views/DataSource/DataSourceAdd.svelte';
	import { DataSource } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import collections from '@/stores/collections';

	import { setData, delData, setCalculation, getTemplate } from '@/services/api';

	import datasources, { datasourcesAsync } from '@/stores/datasources';
	import { withConfirm } from '@/stores/confirmator';

	import { TagsEdit } from '@/views/modals';
	import { setCollection, delCollection } from '@/services/api';

	import type { DataSource } from '@/types/dto';
</script>

<script lang="ts">
	let width;
	let content = '';
	let contents: string[] = [];
	let clearFiles: () => void;
	let points = [];
	let search = '';
	let addOpen = false;
	let modal: { open?: boolean; header?: string; component } = {
		open: false,
		header: '',
		component: null,
	};
	let editor: {
		schema: { [key: string]: any };
		template: string;
		input: string;
	} = {
		schema: {},
		template: '',
		input: '',
	};
	let datasourceID = 0;
	let tags = [];

	function makeDataList(items: DataSource[], search: string) {
		return search
			? items.filter((item) => match(item, search))
			: items.sort((a, b) => b.id - a.id);
	}

	function addDataItem() {
		setData(contents.length ? contents : content);
		content = '';
		clearFiles();
	}

	async function handleFiles(e: any) {
		const { files } = e.detail;

		if (files.length) {
			for (const file of files) {
				const content = await file.text();
				contents.push(content);
			}
			contents = [...contents];
		} else {
			contents = [];
		}
	}

	function calculate(id: number) {
		setCalculation(id);
		toast.success({
			msg: 'Calculation in progress',
			timeout: 2000,
			pos: 'top_right',
			icon: 'forward',
		});
	}

	async function editCalculation(datasource: DataSource) {
		const { template, schema } = await getTemplate('dummy');
		datasourceID = datasource.id;
		editor = { template, schema, input: template };
		// points = [];
		modal = {
			open: true,
			header: `Edit and submit calculation for <mark> ${datasource.name} </mark>`,
			component: Editor,
		};
	}

	function setInput(e: CustomEvent) {
		e.preventDefault();
		if (editor) editor.input = e.detail;
	}

	function submitCalculation() {
		if (editor) setCalculation(datasourceID, 'dummy', editor.input).then(() => (modal = {}));
	}

	function editTags(datasource: DataSource, e: Event) {
		datasourceID = datasource.id;
		// editor = {};
		// points = [];
		modal = {
			open: true,
			header: `Edit and submit Tags for <mark> ${datasource.name} </mark>`,
			component: TagsEdit,
		};
	}

	function submitTags() {
		tags.forEach(async ({ value }) => {
			const { id, title, description, typeId, visibility, dataSources, users } = value;
			await saveCollection({
				id,
				title,
				description,
				typeId,
				visibility,
				dataSources,
				users,
			});
		});
		modal = {};
	}

	$: console.log(tags);

	async function saveCollection(value) {
		try {
			await setCollection(value);
		} catch (err: unknown) {
			console.error(err);
			toast.error({ msg: (err as HttpError).message, timeout: 2000, pos: 'top_right' });
		}
	}

	// async function removeCollection(value) {
	// 	try {
	// 		await delCollection(value.id);
	// 	} catch (err: unknown) {
	// 		toast.error({ msg: (err as HttpError).message, timeout: 2000, pos: 'top_right' });
	// 	}
	// 	closeEdit();
	// }

	function editGraphic(datasource: DataSource, e: Event) {
		// editor = {};
		points = pointsSource;
		modal = {
			open: true,
			header: `Edit and submit Graphic for <mark> ${datasource.name} </mark>`,
			component: Graphic,
		};
	}

	function submitGraphic() {
		modal = {};
	}
</script>

<style lang="scss"></style>
