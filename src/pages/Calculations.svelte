<Main>
	<Filter tooltip="Add calculation" />

	<div bind:clientWidth={width} class="py-2">
		<Grid stack>
			{#await $calculationsAsync}
				{#each { length: 4 } as _}
					<Col col="12">
						<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
					</Col>
				{/each}
			{:then { data, total }}
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
				{#each data as calculation (calculation.id)}
					<Col col="12">
						<Calculation {calculation} />
					</Col>
				{:else}
					<div class="text-center distant_msg">No calculations running</div>
				{/each}
			{:catch error}
				<Col>
					<Overlay>Server disconnected</Overlay>
				</Col>
			{/await}
		</Grid>
	</div>
</Main>

<script lang="ts" context="module">
	import { query } from 'svelte-pathfinder';
	import { Col, Grid, Pagination } from 'svelte-spectre';

	import { Main, Overlay } from '@/layouts/';
	import { Calculation } from '@/views/tiles';
	import { Filter } from '@/components/Filter';
	import * as Loaders from '@/components/loaders';

	import { calculationsAsync } from '@/stores/calculations';
	import { PAGE_LIMIT } from '@/config';
</script>

<script lang="ts">
	let width: number;

	$query.params.limit = PAGE_LIMIT;
</script>
