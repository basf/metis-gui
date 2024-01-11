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
			{#if total > $query.params.limit && paginate}
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
			{#each data.filter(filter) as item (item.id)}
				<slot {item} />
			{:else}
				<div class="text-center distant_msg">
					Nothing found &mdash; maybe <span class="link" on:click={() => goto('/import')}
						>add data</span
					>?
				</div>
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
	import { query, goto } from 'svelte-pathfinder';
	import { Button, Col, Grid, Pagination } from 'svelte-spectre';

	import { Overlay } from '.';
	import { FilterPanel } from '@/components/FilterPanel';
	import * as Loaders from '@/components/loaders';

	import { PAGE_LIMIT } from '@/config';
</script>

<script lang="ts">
	export let filter = (item) => item != null;
	export let add: boolean;
	export let addTooltip: string;
	export let addAction = () => (add = !add);
	export let paginate: boolean = true;
	export let width: number;
	export let asyncData = { data: [], total: 0 } || undefined;

	const mode = getContext('mode');

	$query.params.limit = PAGE_LIMIT;
</script>
