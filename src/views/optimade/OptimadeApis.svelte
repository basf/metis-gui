{#each apis as { data, meta }}
	{#if data}
		<Grid stack>
			{#each data as structure}
				<Col {col}>
					<Tile>
						<h5 class="mt-2" slot="title" bind:this={h5}>
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
	export let col: number;

	let h5;
	$: col = h5?.scrollWidth > h5?.clientWidth + 36 ? col + 2 : 4;

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
		border: 1px solid $gray-color;
		transition: transform 250ms;
		&:hover {
			transform: scale(1.05);
		}
		h5 {
			// word-wrap: break-word;
			// white-space: normal;
		}
	}
</style>
