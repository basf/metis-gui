{#each apis as { data, meta }}
	{#if data?.length}
		<Grid stack offset="mb-2">
			{#each data as structure, i}
				<Col col={!auto ? col : 'auto'} xs="12">
					<div class="tile-structure">
						<Tile>
							<h5 class="mt-2" slot="title">
								{@html getStructureTitle(structure)}
							</h5>
							<small slot="subtitle" class="text-gray">
								ID &bull; {structure.id}
							</small>
							<svelte:fragment slot="action">
								<IconButton
									icon="upload"
									size="sm"
									variant="primary"
									title="Upload this JSON to calculation"
									on:click={() => setDataContent(structure)}
								/>
							</svelte:fragment>
						</Tile>
					</div>
				</Col>
			{/each}
		</Grid>
	{:else}
		<Tile>
			<div class="text-center text-error distant_msg">
				Nothing found. Try another provider?
			</div>
		</Tile>
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
	export let col: number = 3;
	export let width: number = 0;
	export let auto: boolean = false;

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
	.tile-structure {
		&:hover {
			:global(.tile .tile-action) {
				visibility: visible;
			}
		}
		:global(.tile) {
			position: relative;
			transition-duration: 150ms;
			transition-property: box-shadow, background-color;
			border-radius: 0.1rem;
			&:hover {
				box-shadow: 0 0 0 0.05rem $gray-color;
				background-color: $secondary-color;
			}
			:global(.tile-title h5) {
				overflow: hidden;
				text-overflow: ellipsis;
				letter-spacing: -0.025rem;
				// font-size: 0.9rem;
			}
			:global(.tile-action) {
				position: absolute;
				right: -0.05rem;
				bottom: -0.05rem;
				visibility: hidden;
			}
		}
	}
</style>
