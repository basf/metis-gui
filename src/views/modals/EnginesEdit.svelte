<!-- <h3>Select engine</h3> -->
<Select options={getOptions($engines)} bind:value={engine} placeholder="Engines" />

<script lang="ts" context="module">
	import { fragment } from 'svelte-pathfinder';
	import { Select } from 'svelte-spectre';
	import { engines } from '@/stores/calculations';
</script>

<script lang="ts">
	let engine = '';

	const [, , dataId] = $fragment.split('-');

	$: $fragment = `#edit-engine-${dataId}-${engine}`;

	function getOptions(engines) {
		return engines?.map((engine) => ({ label: engine, value: engine }));
	}
</script>
