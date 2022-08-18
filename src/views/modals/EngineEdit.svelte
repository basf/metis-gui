<Select options={getOptions($engines)} bind:value={engine} placeholder="Select..." />

<script lang="ts" context="module">
	import { fragment } from 'svelte-pathfinder';
	import { Select } from 'svelte-spectre';
	import { engines } from '@/stores/calculations';
</script>

<script lang="ts">
	export let dataSourceId: number;
	export let disable = false;

	let engine = 'dummy';

	$: disable = !engine;

	$: $fragment = `#edit-engine-${dataSourceId}-${engine}`;

	function getOptions(engines) {
		return engines?.map((engine) => ({ label: engine, value: engine }));
	}
</script>
