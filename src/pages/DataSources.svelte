<Main>
	<form method="GET" on:submit on:submit|preventDefault class="py-2">
		<Input
			bind:value={search}
			options={suggested}
			placeholder=" Datasource name"
			autocomplete="on"
			type="search"
			name="q"
			autofocus
			inline
			size="lg"
		>
			<span slot="iconRight">
				{#if search}
					<IconButton type="button" icon="cross" on:click={() => (search = '')} />
				{/if}
			</span>
		</Input>
	</form>

	{#each makeDataList($datasources, search) as datasource, i (datasource)}
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
					on:setCalculation={() => calculate(datasource.id)}
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
	{:else if points.length}
		<Graphic {points} source={pointsSource} />
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
	import { Button, Col, Divider, Grid, Input, Modal, Tile, toast } from 'svelte-spectre';

	import Editor from '@/components/Editor/Editor.svelte';

	import Main from '@/layouts/Main.svelte';
	import Upload from '@/components/Upload.svelte';
	import Graphic from '@/components/Graphic/Graphic.svelte';
	import pointsSource from '@/components/Graphic/points';
	import DataSourcesMenu from '@/views/DataSourcesMenu.svelte';
	import DataSourcesTags from '@/views/DataSourcesTags.svelte';

	import { getData, setData, delData, setCalculation, getTemplate } from '@/services/api';

	import datasources from '@/stores/datasources';
	import user from '@/stores/user';
	import { showTimestamp } from '@/helpers/date';
	import { withConfirm } from '@/stores/confirmator';

	import type { DataSource } from '@/types/dto';
</script>

<script lang="ts">
	let content = '';
	let contents: string[] = [];
	let clearFiles: Function;
	let points = [];
	let search = '';

	$: suggested = search ? makeSuggested($datasources) : [];

	function makeDataList(items: DataSource[], search: string) {
		return search ? items.filter((item) => math(item)) : items.sort((a, b) => b.id - a.id);
	}
	function makeSuggested(items: DataSource[]): Option[] {
		return items.map((item) => math(item) && cleanup(item.name)).filter(Boolean);
	}
	const math = (item: DataSource) =>
		cleanup(item.name).toLowerCase().includes(search.toLowerCase());

	const cleanup = (string: string): string => string.replace(/(<([^>]+)>)/gi, '') || '';

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

	$: $user && getData();
	$: $datasources.length &&
		toast.primary({ msg: 'Structures synced', timeout: 2000, pos: 'top_right' });
	$: data = $datasources;

	$: (async () => console.log(await getData()))();

	function calculate(id: number) {
		setCalculation(id);
		toast.success({
			msg: 'Calculation in progress',
			timeout: 2000,
			pos: 'top_right',
			icon: 'forward',
		});
	}

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
