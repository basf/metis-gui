{#each apis as { data, meta }}
	{#if data}
		<Grid stack>
			{#each data as structure, i}
				<Col col={!auto ? col : 'auto'} xs="12">
					<Tile>
						<h5 class="mt-2" slot="title" bind:this={h5[i]}>
							{@html getStructureTitle(structure)}
						</h5>
						<small slot="subtitle" class="tile-subtitle text-gray">
							ID &bull; {structure.id}
						</small>
						<svelte:fragment slot="action">
							<IconButton
								icon="upload"
								title="Upload this JSON to calculation"
								on:click={() => setDataContent(structure)}
							/>
						</svelte:fragment>
					</Tile>
				</Col>
			{:else}
				<Tile>
					<div class="text-center text-error distant_msg">
						Nothing found. Try another provider?
					</div>
				</Tile>
			{/each}
		</Grid>
	{/if}
{/each}

<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { goto } from 'svelte-pathfinder';
	import { content } from '@/stores/data';
	import { getStructureTitle } from '@/helpers/optimade';
	import { Col, Grid, IconButton, Tile } from 'svelte-spectre';

	import type { Types } from 'optimade';
</script>

<script lang="ts">
	export let apis: Types.StructuresResponse[] = [];
	export let data: Types.Structure[] | undefined;
	export let meta: Types.Meta | undefined;
	export let col: number = 1;
	export let width: number = 4;
	export let auto: boolean = false;

	let h5: Element[] = [];

	function setCol(h5: Element[]) {
		const maxColWidth = h5.reduce((a, h) => {
			const width = h.scrollWidth + 32;
			return a < width ? width : a;
		}, 0);
		const count = Math.trunc(width / maxColWidth);
		col = Math.ceil(12 / count);
	}

	$: h5?.length === data?.length && setCol(h5);

	onMount(() => {
		data = apis.find((a) => a.meta?.data_returned)?.data;
		meta = apis.find((a) => a.meta?.data_returned)?.meta;
	});

	function setDataContent(structure: Types.Structure) {
		$content = JSON.stringify(structure);
		goto('/');
	}
</script>

<style lang="scss">
	:global(.spectre .tile) {
		position: relative;
		transition: transform 250ms;
		:global(.tile-action) {
			position: absolute;
			right: 0;
			bottom: 0;
		}
		&:hover {
			transform: scale(1.05);
			box-shadow: 0 0 0 1px $gray-color;
		}
	}
</style>
