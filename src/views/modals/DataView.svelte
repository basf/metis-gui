{#await getDataSource(dataSourceId)}
	<Loaders.Circle big />
{:then data}
	<div id="controls">
		<Select {options} bind:value={selectedView} />
	</div>
	{#if selectedView === 'json'}
		<Code lang="json">{JSON.stringify(data, 0, 2)}</Code>
	{:else if selectedView === 'plot'}
		<Plot source={pointsSource} />
	{/if}
{/await}

<script lang="ts" context="module">
	import { Select, Code } from 'svelte-spectre';

	import { Plot } from '@/components/Plot';
	import * as Loaders from '@/components/loaders';
	import pointsSource from '@/components/Plot/points';

	import { getDataSource } from '@/services/api';
</script>

<script lang="ts">
	export let dataSourceId: number;

	const options = ['json', 'plot'];

	let selectedView = 'json';
</script>

<style lang="scss">
	#controls {
		position: sticky;
		top: 0;
		padding-bottom: 0.8rem;
	}
</style>
