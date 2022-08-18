{#await getDataSource(dataSourceId)}
	<Loaders.Circle big />
{:then data}
	<div id="controls">
		<Grid>
			{#if selectedView === 'json'}
				<Col col="auto">
					<IconButton
						variant="default"
						icon="download"
						tooltip="Download JSON"
						download={setDownload(dataSourceName)}
						href={setHref(data)}
					/>
				</Col>
			{/if}
			<Col>
				<Select {options} bind:value={selectedView} />
			</Col>
		</Grid>
	</div>
	{#if selectedView === 'json'}
		<Code lang="json">{JSON.stringify(data, 0, 2)}</Code>
	{:else if selectedView === 'plot'}
		<Plot source={pointsSource} />
	{/if}
{/await}

<script lang="ts" context="module">
	import { Col, Grid, IconButton, Select, Code } from 'svelte-spectre';

	import { Plot } from '@/components/Plot';
	import * as Loaders from '@/components/loaders';
	import pointsSource from '@/components/Plot/points';

	import { getDataSource } from '@/services/api';
</script>

<script lang="ts">
	export let dataSourceId: number;
	export let dataSourceName: string = '';

	const options = ['json', 'plot'];

	let selectedView = 'json';

	function setHref(json: void) {
		const text = JSON.stringify(json);
		return 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
	}

	function setDownload(name: string) {
		return name.replace(/<\/?[^>]+(>|$)/g, '') + '.json';
	}
</script>

<style lang="scss">
	#controls {
		position: sticky;
		top: 0;
		padding-bottom: 0.8rem;
	}
</style>
