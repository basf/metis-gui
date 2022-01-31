<Main>
	{#each $datasources as datasource (datasource.id)}
		<Tile>
			<h5 class="mt-2" slot="title">{@html datasource.name}</h5>
			<svelte:fragment slot="subtitle">
				<small class="tile-subtitle text-gray">
					Type &bull; {datasource.type} &bull; {showTimestamp(datasource)}
				</small>
			</svelte:fragment>
			<svelte:fragment slot="action">
				<IconButton slot="icon" icon="edit" on:click={() => editCalculation(datasource)} />
				<IconButton icon="forward" on:click={() => setCalculation(datasource.id)} />
				<IconButton icon="cross" on:click={() => delData(datasource.id)} />
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

<Modal bind:open size="fs">
	<h3 slot="header">{@html modalHeader}</h3>
	{#if template}
		<Editor code={template} {schema} on:change={(e) => (input = e.detail)} />
	{:else}
		<span style="height: 100%" class="loading loading-lg p-centered d-block" />
	{/if}
	<svelte:fragment slot="footer">
		<Button variant="primary" on:click={submitCalculation}>Submit</Button>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { onMount } from 'svelte';

	import {
		Button,
		Col,
		Divider,
		Grid,
		Hero,
		IconButton,
		Input,
		Modal,
		Tile,
	} from 'svelte-spectre';

	import Editor from '@/components/Editor/Editor.svelte';

	import Main from '@/layouts/Main.svelte';
	import Upload from '@/components/Upload.svelte';

	import { getData, setData, delData, setCalculation, getTemplate } from '@/services/api';

	import datasources from '@/stores/datasources';
	import { showTimestamp } from '@/helpers/date';

	import type { DataSource } from '@/types/dto';
</script>

<script lang="ts">
	let content = '';
	let contents: string[] = [];
	let clearFiles: Function;
	let open = false;
	let modalHeader = '';
	let template = '';
	let input = '';
	let schema = {};
	let id = 0;

	onMount(async () => {
		setTimeout(getData);
	});

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

	async function editCalculation(datasource: DataSource) {
		open = !open;
		modalHeader = `Edit and submit calculation for <mark> ${datasource.name} </mark>`;
		getTemplate('dummy').then((code) => {
			template = code.template;
			schema = code.schema;
			id = datasource.id;
		});
	}

	function submitCalculation() {
		setCalculation(id, 'dummy', input).then(() => (open = !open));
	}
</script>
