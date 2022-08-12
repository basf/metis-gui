<Grid>
	<Col>
		<Select options={getEngines($engines)} bind:value={engine} placeholder="Select engine..." />
	</Col>
	<Col>
		<Select options={modes} bind:value={mode} placeholder="Represent like..." />
	</Col>
</Grid>

{#await getTemplate(engine)}
	<Loaders.Circle big />
{:then { template, schema }}
	{#if $fragment.includes('code')}
		<Code code={template} on:change={(e) => (input = e.detail)} />
	{:else}
		<Form {template} {schema} bind:input />
	{/if}
{:catch error}
	{error}
{/await}

<script lang="ts" context="module">
	import { fragment } from 'svelte-pathfinder';
	import { Col, Grid, Select } from 'svelte-spectre';

	import * as Loaders from '@/components/loaders';
	import { Code, Form } from '@/components/Editor';

	import { getTemplate } from '@/services/api';
	import { engines } from '@/stores/calculations';
</script>

<script lang="ts">
	export let dataSourceId = 0;
	export let input = '';

	let engine = 'dummy';
	let mode = 'code';
	let modes = [
		{ label: 'Code', value: 'code' },
		{ label: 'Form', value: 'form' },
	];

	$: $fragment = `#edit-calculation-${dataSourceId}-${engine}-${mode}`;

	function getEngines(engines) {
		return engines?.map((engine) => ({ label: engine, value: engine }));
	}
</script>
