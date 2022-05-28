<Main>
	<div bind:clientWidth={width}>
		{#await $calculationsAsync}
			{#each { length: 4 } as _}
				<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
			{/each}
		{:then calculations}
			{#each calculations as calculation (calculation.id)}
				{#if calculation.result}
					{#each calculation.result as datasource}
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
	import Main from '@/layouts/Main.svelte';
	import { Calculation, DataSource } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';

	import { calculationsAsync } from '@/stores/calculations';
</script>

<script lang="ts">
	let width: number;
</script>
