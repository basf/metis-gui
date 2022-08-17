{#await getDataSource(dataSourceId)}
	<Loaders.Circle big />
{:then data}
	{data}
	<Plot source={pointsSource} />
{/await}

<script lang="ts" context="module">
	import { Plot } from '@/components/Plot';
	import * as Loaders from '@/components/loaders';
	import pointsSource from '@/components/Plot/points';

	import { getDataSource } from '@/services/api';
</script>

<script lang="ts">
	export let dataSourceId: number;
</script>
