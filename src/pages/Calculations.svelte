<Main>
	<div bind:clientWidth={width}>
		{#if !$status.hidden}
			{#await $calculationsAsync}
				{#each { length: 4 } as _}
					<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
				{/each}
			{:then calculations}
				{#each calculations as calculation (calculation.id)}
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
		{/if}
	</div>
</Main>

<script lang="ts" context="module">
	import Main from '@/layouts/Main.svelte';
	import { Calculation, DataSource } from '@/views/tiles';
	import * as Loaders from '@/components/loaders';
	import status from '@/stores/status';

	import { calculationsAsync } from '@/stores/calculations';
</script>

<script lang="ts">
	let width: number;
</script>
