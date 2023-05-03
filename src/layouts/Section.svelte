{#if mode !== 'light'}
	<slot name="filter">
		<FilterPanel icon={add ? 'minus' : 'plus'} action={addAction} bind:tooltip={addTooltip} />
	</slot>
{/if}

<div bind:clientWidth={width} class="py-2">
	<Grid stack>
		{#await asyncData}
			<slot name="loader">
				{#each { length: 4 } as _}
					<Col col="12">
						<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
					</Col>
				{/each}
			</slot>
		{:then { data, total }}
			<slot name="add" {add} />
			{#if total > $query.params.limit}
				<Col col="12">
					<Pagination
						bind:page={$query.params.page}
						limit={$query.params.limit}
						perpage={false}
						rest={5}
						{total}
					/>
				</Col>
			{/if}
			{#each data as item (item.id)}
				<slot {item} />
			{:else}
				<div class="text-center distant_msg">No items</div>
			{/each}
		{:catch _error}
			<Col>
				<Overlay>Server disconnected</Overlay>
			</Col>
		{/await}
	</Grid>
</div>

<script lang="ts" context="module">
	import { getContext } from 'svelte';
	import { query } from 'svelte-pathfinder';
	import { Col, Grid, Pagination } from 'svelte-spectre';

	import { Overlay } from '.';
	import { FilterPanel } from '@/components/FilterPanel';
	import * as Loaders from '@/components/loaders';

	import { PAGE_LIMIT } from '@/config';
</script>

<script lang="ts">
	export let add: boolean;
	export let addTooltip: string;
	export let addAction = () => (add = !add);
	export let width: number;
	export let asyncData = { data: [], total: 0 } || undefined;

	const mode = getContext('mode');

	$query.params.limit = PAGE_LIMIT;
</script>
