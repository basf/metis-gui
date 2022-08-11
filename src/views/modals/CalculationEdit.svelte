{#if $editorCode.template}
	<Grid>
		<Col>
			<Select
				options={getEngines($engines)}
				bind:value={engine}
				placeholder="Select engine..."
			/>
		</Col>
		<Col>
			<Select options={modes} bind:value={mode} placeholder="Represent like..." />
		</Col>
	</Grid>

	{#if $fragment.includes('code')}
		<Editor code={$editorCode.template} on:change={(e) => ($editorCode.input = e.detail)} />
	{:else}
		<Form>Form representation placeholder</Form>
	{/if}
{:else}
	<Loaders.Circle big />
{/if}

<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { fragment } from 'svelte-pathfinder';
	import { Form, Col, Grid, Select } from 'svelte-spectre';

	import * as Loaders from '@/components/loaders';
	import { Editor } from '@/components/Editor';

	import { getTemplate } from '@/services/api';
	import { editorCode } from '@/stores/editor';
	import { engines } from '@/stores/calculations';
</script>

<script lang="ts">
	export let dataSourceId = 0;

	let engine = 'dummy';
	let mode = 'code';
	let modes = [
		{ label: 'Code', value: 'code' },
		{ label: 'Form', value: 'form' },
	];

	onMount(async () => {
		$editorCode = await getTemplate(engine);
	});

	$: $fragment = `#edit-calculation-${dataSourceId}-${engine}-${mode}`;

	function getEngines(engines) {
		return engines?.map((engine) => ({ label: engine, value: engine }));
	}
</script>
