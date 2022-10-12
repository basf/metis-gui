{#await getDataSource(dataSourceId) then data}
	<div class="extapp">
		<iframe name="visualisationFrame" on:load={() => load(data.content)} src={VISUALIZER_URL} frameborder=0 scrolling="no" />
	</div>
{/await}

<script lang="ts" context="module">
	import { VISUALIZER_URL } from '@/config';
	import { getDataSource } from '@/services/api';
</script>

<script lang="ts">
	export let dataSourceId: number;

	function load(message){
		const timer = setInterval(() => {
			const visualisationFrame = window.frames.visualisationFrame;
			if (visualisationFrame) {
				visualisationFrame.postMessage(message, '*');
				clearInterval(timer);
			}
		}, 250);
	}
</script>

<style>
	.extapp {
		overflow: hidden;
		padding-top: 60%;
		position: relative;
	}
	.extapp iframe {
		border: 0;
		height: 100%;
		left: 0;
		position: absolute;
		top: 0;
		width: 100%;
	}
</style>
