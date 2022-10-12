<div class="py-2">
	{#if msg}
		<div class="text-center distant_msg">Upload a structure to start...</div>
	{/if}

	<Grid stack>
		<Col sm="12">
			<Input rows={2} placeholder="Paste POSCAR, CIF, or Optimade JSON" bind:value />
		</Col>
		<Divider align={!$media.sm ? 'vertical' : 'horizontal center'} text="OR" />
		<Col sm="12">
			<Upload on:files={handleFiles} bind:clearFiles />
		</Col>
	</Grid>

	<Button variant="primary" block on:click={addDataSourceItem}>
		{contents.length ? 'Add data' : 'Add structure'}
	</Button>
</div>

<script lang="ts" context="module">
	import { Button, Col, Divider, Grid, Input, toast } from 'svelte-spectre';
	import { Upload } from '@/components/Upload/';

	import { media } from '@/stores/media';
	import { setDataSources } from '@/services/api';
</script>

<script lang="ts">
	let value = '';

	export let msg = false;

	let clearFiles: () => void,
		contents: string[] = [];

	async function addDataSourceItem() {
		try {
			const uploaded = await setDataSources(contents.length ? contents : value);
			//console.log(uploaded);
			clearFiles();
			value = '';
		} catch (error) {
			toast.error({ msg: `Sorry, cannot upload file`, timeout: 4000, pos: 'top_right' });
		}
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
</script>
