<div bind:clientWidth={width}>
	<Grid>
		{#await asyncData}
			{#each { length: 10 } as _}
				<slot name="loader" {width} />
			{/each}
		{:then { data, total }}
			{#if add || !total}
				<Col col="12">
					<slot name="add" {total} />
				</Col>
			{/if}
			<Col col="12">
				<Pagination
					bind:limit={$query.params.limit}
					bind:page={$query.params.page}
					limits={[5, 10, 50, 100]}
					total={total || 10}
					rest={7}
				/>
			</Col>
			{#each data as item (item)}
				<Col {col}><slot {item} {col} /></Col>
			{/each}
		{/await}
	</Grid>
</div>

<script lang="ts" context="module">
	import { query } from 'svelte-pathfinder';
	import { Col, Grid, Pagination } from 'svelte-spectre';
</script>

<script>
	export let asyncData = { data: [], total: 0 };
	export let add = false;

	let width = 0,
		col = 12;
</script>
