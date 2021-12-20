<Main>
	{#each $datasources as datasource (datasource.id)}
		<Tile>
			<h5 class="mt-2" slot="title">{datasource.name}</h5>
			<svelte:fragment slot="subtitle">
				<small class="tile-subtitle text-gray">
					Type &bull; {datasource.type} &bull; {showTimestamp(datasource)}
				</small
			>
			</svelte:fragment>
			<svelte:fragment slot="action">
				<IconButton icon="refresh" on:click={() => setCalculation(datasource.id)} />
				<IconButton icon="cross" on:click={() => delData(datasource.id)} />
			</svelte:fragment>
		</Tile>
	{:else}
		<div class="text-center distant_msg">Upload a structure to start...</div>
	{/each}
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
</Main>

<script lang="ts" context="module">
	import { onMount } from 'svelte';

	import {
		Tile,
		Button,
		Divider,
		IconButton,
		Input,
		Grid,
		Col,
	} from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';
	import Upload from '@/components/Upload.svelte';

	import {
		getData,
		setData,
		delData,
		setCalculation,
	} from '@/services/api';

	import datasources from '@/stores/datasources';
	import { showTimestamp } from '@/helpers/date';
</script>

<script lang="ts">
	let content = '';
	let contents: string[] = [];
	let clearFiles;

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
			for(const file of files) {
				const content = await file.text();
				contents.push(content);
			}
			contents = [ ...contents ];
		} else {
			contents = [];
		}
	}
</script>
