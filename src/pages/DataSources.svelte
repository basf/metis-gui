<Main>
	<TabSearch bind:value={search} data={$datasources} />

	{#each makeDataList($datasources, search) as datasource, i (datasource)}
		<Tile centered={false}>
			<svelte:fragment slot="title">
				<h5 class="mt-2">{@html datasource.name}</h5>
				<TileTags />
			</svelte:fragment>
			<svelte:fragment slot="subtitle">
				<small class="text-gray">
					Type &bull; {datasource.type} &bull; {showTimestamp(datasource)}
				</small>
			</svelte:fragment>
			<svelte:fragment slot="action">
				<TileMenu
					data={$datasources}
					items={tileMenuItems}
					dataId={datasource.id}
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
			</svelte:fragment>
		</Tile>
	{:else}
		<div class="text-center distant_msg">Upload a structure to start...</div>
	{/each}
	<div class="mt-4">
		<DataSourceAdd
			{contents}
			bind:clearFiles
			bind:value={content}
			on:files={handleFiles}
			on:click={addDataItem}
		/>
	</div>
</Main>

<Modal bind:open={modal.open} size="fs">
	<h3 slot="header">{@html modal.header}</h3>
	{#if editor.template}
		<Editor bind:code={editor.template} schema={editor.schema} on:change={setInput} />
	{:else if points.length}
		<Graphic source={pointsSource} />
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
	import { Button, Modal, Tile, toast } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';
	import { Editor } from '@/components/Editor/';
	import { Graphic } from '@/components/Graphic/';
	import pointsSource from '@/components/Graphic/points';
	import { TileMenu, TileTags } from '@/components/Tile/';
	import { TabSearch, match } from '@/components/Search/';

	import { getData, setData, delData, setCalculation, getTemplate } from '@/services/api';

	import datasources from '@/stores/datasources';
	import user from '@/stores/user';
	import { withConfirm } from '@/stores/confirmator';
	import { showTimestamp } from '@/helpers/date';

	import DataSourceAdd from '@/views/DataSource/DataSourceAdd.svelte';
	import type { DataSource } from '@/types/dto';

	import Sinus from '@/assets/img/sinus.svg';
</script>

<script lang="ts">
	let content = '';
	let contents: string[] = [];
	let clearFiles: () => void;
	let points = [];
	let search = '';
	let tileMenuItems = [
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
	let modal: { open?: boolean; header?: string } = { open: false, header: '' };
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

	$: $user && getData();
	$: $datasources.length &&
		toast.primary({ msg: 'Structures synced', timeout: 2000, pos: 'top_right' });

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
		modal = {
			open: true,
			header: `Edit and submit calculation for <mark> ${datasource.name} </mark>`,
		};

		getTemplate('dummy').then(({ template, schema }) => {
			datasourceID = datasource.id;
			editor = { template, schema, input: template };
		});
	}

	function setInput(e: CustomEvent) {
		e.preventDefault();
		if (editor) editor.input = e.detail;
	}

	function submitCalculation() {
		if (editor) setCalculation(datasourceID, 'dummy', editor.input).then(() => (modal = {}));
	}

	function editTags(datasource: DataSource, e: Event) {
		editor = {};
		points = [];
		modal = {
			open: true,
			header: `Edit and submit Tags for <mark> ${datasource.name} </mark>`,
		};
	}

	function submitTags() {
		modal = {};
	}

	function editGraphic(datasource: DataSource, e: Event) {
		editor = {};
		points = pointsSource;
		modal = {
			open: true,
			header: `Edit and submit Graphic for <mark> ${datasource.name} </mark>`,
		};
	}

	function submitGraphic() {
		modal = {};
	}
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
</style>
