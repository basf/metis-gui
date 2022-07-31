<Main>
	<Filter tooltip="Add calculation" />

	<Pagination
		bind:limit={$query.params.limit}
		bind:page={$query.params.page}
		limits={[10, 50, 100]}
		total={$calculations.total}
		rest={7}
	/>

	<div bind:clientWidth={width}>
		{#await $calculationsAsync}
			{#each { length: 4 } as _}
				<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
			{/each}
		{:then { data }}
			{#each data as calculation (calculation.id)}
				{#if calculation.data}
					{#each calculation.data as datasource}
						<DataSource {datasource} />
					{/each}
				{:else}
					<Calculation {calculation} />
				{/if}
			{:else}
				<div class="text-center distant_msg">No calculations</div>
			{/each}
		{/await}
	</div>
</Main>

<script lang="ts" context="module">
	import { query } from 'svelte-pathfinder';
	import { Main } from '@/layouts/';
	import { Calculation, DataSource } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import calculations, { calculationsAsync } from '@/stores/calculations';
	import { Filter } from '@/components/Filter';
	import { Pagination } from 'svelte-spectre';
</script>

<script lang="ts">
	let width: number;
</script>
