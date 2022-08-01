<Main>
	<Filter tooltip="Add calculation" />

	<Pagination
		bind:limit={$query.params.limit}
		bind:page={$query.params.page}
		limits={[5, 10, 50, 100]}
		total={$calculations.total}
	/>

	<div bind:clientWidth={width}>
		<Grid stack>
			{#await $calculationsAsync}
				{#each { length: 4 } as _}
					<Col col="12">
						<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
					</Col>
				{/each}
			{:then { data }}
				{#each data as calculation (calculation.id)}
					<Col col="12">
						<Calculation {calculation} />
					</Col>
				{:else}
					<div class="text-center distant_msg">No calculations</div>
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
	import { Main, Overlay } from '@/layouts/';
	import { Calculation } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import calculations, { calculationsAsync } from '@/stores/calculations';
	import { Filter } from '@/components/Filter';
	import { Col, Grid, Pagination } from 'svelte-spectre';
</script>

<script lang="ts">
	let width: number;
</script>
