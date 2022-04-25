{#each apis as { data, meta }}
	{#if data?.length}
		<Grid stack>
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
									icon="download"
									size="sm"
									variant="primary"
									title="Use this structure"
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
	import { getStructureTitle } from '@/helpers/optimade';
	import { Col, Grid, IconButton, Tile, toast } from 'svelte-spectre';

	import type { Types } from 'optimade';

	import { setData } from '@/services/api';
</script>

<script lang="ts">
	export let apis: Types.StructuresResponse[] = [];
	export let data: Types.Structure[] | undefined;
	export let meta: Types.Meta | undefined;
	export let col = 3;
	export let auto = false;

	onMount(() => {
		data = apis.find((a) => a.meta?.data_returned)?.data;
		meta = apis.find((a) => a.meta?.data_returned)?.meta;
	});

	function setDataContent(structure: Types.Structure) {
		setData(JSON.stringify(structure));
		toast.success({
			msg: 'Data downloaded',
			timeout: 2000,
			pos: 'top_right',
			icon: 'download',
		});
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
			:global(.tile-title h5) {
				overflow: hidden;
				text-overflow: ellipsis;
				letter-spacing: -0.025rem;
			}
			:global(.tile-action) {
				position: absolute;
				right: -0.05rem;
				bottom: -0.05rem;
				visibility: hidden;
			}
		}
	}
	:global(.tile) {
		position: relative;
		transition-duration: 150ms;
		transition-property: box-shadow, background-color;
		border-radius: 0.1rem;
		padding-left: 0.5em;
		&:hover {
			box-shadow: 0 0 0 0.05rem $primary-color;
			background-color: $secondary-color;

			@media (prefers-color-scheme: dark) {
				background-color: $dark-secondary;
			}
		}
	}
	:global([color-scheme='dark']) {
		:global(.tile:hover) {
			background-color: $dark-secondary;
		}
	}
	:global([color-scheme='light']) {
		:global(.tile:hover) {
			background-color: $secondary-color;
		}
	}
</style>
