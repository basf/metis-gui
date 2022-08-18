{#await getDataSource(dataSourceId)}
	<Loaders.Circle big />
{:then data}
	{#if Array.isArray(data.content)}
		<Plot source={data.content} />
	{:else}
		<Code lang="json">{JSON.stringify(data, 0, 2)}</Code>
	{/if}
{/await}

<script lang="ts" context="module">
	import { Code } from 'svelte-spectre';

	import { Plot } from '@/components/Plot';
	import * as Loaders from '@/components/loaders';

	import { getDataSource } from '@/services/api';
</script>

<script lang="ts">
	export let dataSourceId: number;
</script>
