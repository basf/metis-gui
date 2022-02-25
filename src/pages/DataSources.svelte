<Main>
	{#each $datasources.sort((a, b) => b.id - a.id) as datasource, i (datasource.id)}
		<Tile centered={false}>
			<svelte:fragment slot="title">
				<h5 class="mt-2">{@html datasource.name}</h5>
				<DataSourcesTags />
			</svelte:fragment>
			<svelte:fragment slot="subtitle">
				<small class="text-gray">
					Type &bull; {datasource.type} &bull; {showTimestamp(datasource)}
				</small>
			</svelte:fragment>
			<svelte:fragment slot="action">
				<DataSourcesMenu
					bind:active={data[i].menu}
					{datasource}
					bind:data
					on:editCalculation={(e) => editCalculation(datasource, e)}
					on:editTags={(e) => editTags(datasource, e)}
					on:editGraphic={(e) => editGraphic(datasource, e)}
					on:setCalculation={() => setCalculation(datasource.id)}
					on:delCalculation={() =>
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
		<Grid>
			<Col>
				<Input
					rows={4}
					placeholder="Paste POSCAR, CIF, or Optimade JSON"
					bind:value={content}
				/>
			</Col>
			<Divider align="vertical" text="OR" />
			<Col>
				<Upload on:files={handleFiles} bind:clearFiles />
			</Col>
		</Grid>
		<Button variant="primary" block on:click={addDataItem}>
			{contents.length ? 'Add data' : 'Add structure'}
		</Button>
	</div>
</Main>

<Modal bind:open={modal.open} size="fs">
	<h3 slot="header">{@html modal.header}</h3>
	{#if editor.template}
		<Editor bind:code={editor.template} schema={editor.schema} on:change={setInput} />
	{:else}
		<span style="height: 100%" class="loading loading-lg p-centered d-block" />
	{/if}
	<svelte:fragment slot="footer">
		<Button variant="primary" on:click={editor.template ? submitCalculation : submitTags}
			>Submit</Button
		>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { onMount } from 'svelte';

	import {
		Badge,
		Button,
		Col,
		Divider,
		Dropdown,
		Grid,
		Hero,
		Icon,
		IconButton,
		Input,
		Menu,
		Modal,
		Tile,
	} from 'svelte-spectre';

	import Editor from '@/components/Editor/Editor.svelte';

	import Main from '@/layouts/Main.svelte';
	import Upload from '@/components/Upload.svelte';
	import DataSourcesMenu from '@/views/DataSourcesMenu.svelte';
	import DataSourcesTags from '@/views/DataSourcesTags.svelte';

	import { getData, setData, delData, setCalculation, getTemplate } from '@/services/api';

	import datasources from '@/stores/datasources';
	import { showTimestamp } from '@/helpers/date';
	import { withConfirm } from '@/stores/confirmator';

	import type { DataSource } from '@/types/dto';
</script>

<script lang="ts">
	let content = '';
	let contents: string[] = [];
	let clearFiles: Function;

	let modal: { open: boolean; header: string } | {} = { open: false, header: '' },
		editor: {
			schema: { [key: string]: any };
			template: string;
			input: string;
		} = {
			schema: {},
			template: '',
			input: '',
		},
		datasourceID = 0,
		data: DataSource[];

	onMount(async () => {
		setTimeout(getData);
	});

	$: data = $datasources;

	function addDataItem() {
		setData(contents.length ? contents : content);
		content = '';
		clearFiles();
	}

	async function handleFiles(e) {
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

	async function editCalculation(datasource: DataSource, e: Event) {
		modal = {
			open: true,
			header: `Edit and submit calculation for <mark> ${datasource.name} </mark>`,
		};

		getTemplate('dummy').then(({ template, schema }) => {
			datasourceID = datasource.id;
			editor = { template, schema, input: template };
		});
	}

	function setInput(e: Event) {
		e.preventDefault();
		if (editor) editor.input = e.detail;
	}

	function submitCalculation() {
		if (editor) setCalculation(datasourceID, 'dummy', editor.input).then(() => (modal = {}));
	}

	function editTags(datasource: DataSource, e: Event) {
		editor = {};
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
	}
	h5 {
		display: inline;
	}
</style>
