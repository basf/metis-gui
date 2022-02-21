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
				<IconButton icon="edit" on:click={(e) => editCalculation(datasource, e)} />
				<IconButton icon="tag" on:click={(e) => editTags(datasource, e)} />
				<IconButton icon="forward" on:click={() => setCalculation(datasource.id)} />
				<IconButton
					icon="cross"
					color="error"
					class="text-error"
					on:click={() =>
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

<Modal bind:open={modalOpen} size="fs">
	<h3 slot="header">{@html modalHeader}</h3>
	{#if template}
		<Editor code={template} {schema} on:change={setInput} />
	{:else}
		<span style="height: 100%" class="loading loading-lg p-centered d-block" />
	{/if}
	<svelte:fragment slot="footer">
		<Button variant="primary" on:click={template ? submitCalculation : submitTags}
			>Submit</Button
		>
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

	import { withConfirm } from '@/stores/confirmator';
</script>

<script lang="ts">
	let content = '';
	let contents: string[] = [];
	let clearFiles: Function;
	let modalOpen = false;
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

	async function editCalculation(datasource: DataSource, e: Event) {
		e.target.nodeName === 'BUTTON' ? e.target.blur() : e.target.offsetParent.blur();
		modalOpen = !modalOpen;
		modalHeader = `Edit and submit calculation for <mark> ${datasource.name} </mark>`;
		getTemplate('dummy').then((code) => {
			template = code.template;
			schema = code.schema;
			id = datasource.id;
			input = template;
		});
	}

	function submitCalculation() {
		setCalculation(id, 'dummy', input).then(() => (modalOpen = !modalOpen));
	}

	function setInput(e) {
		e.preventDefault();
		input = e.detail;
	}

	function editTags(datasource: DataSource, e: Event) {
		template = schema = input = '';
		modalOpen = !modalOpen;
		modalHeader = `Edit and submit Tags for <mark> ${datasource.name} </mark>`;
	}

	function submitTags() {
		modalOpen = !modalOpen;
	}
</script>

<style lang="scss" global>
	.icon-edit::after {
		left: 9% !important;
		top: 96% !important;
	}
	// icon-tag
	.icon-tag {
		display: block;
		border: 2px solid;
		border-right: 0;
		border-top-left-radius: 3px;
		border-bottom-left-radius: 3px;
		box-sizing: border-box;
		transform: scale(var(--ggs, 0.8)) rotate(-45deg);
		position: relative;
		width: 19px !important;
		height: 14px !important;

		&::before {
			content: '';
			display: block;
			border: 2px solid;
			position: absolute;
			width: 2px;
			height: 2px;
			box-sizing: content-box !important;
			border-radius: 100px;
			left: 85% !important;
			top: 2px;
		}
		&::after {
			content: '';
			display: block;
			box-sizing: border-box;
			position: absolute;
			width: 10px;
			height: 10px;
			border-bottom: 2px solid;
			border-right: 2px solid;
			border-bottom-right-radius: 4px;
			transform: rotate(-45deg) !important;
			top: 0 !important;
			left: 70% !important;
		}
	}
</style>
