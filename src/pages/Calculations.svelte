<Main>
	{#each $calculations as calculation (calculation.id)}
		<Tile>
			<h5 class="mt-2" slot="title">{calculation.id}</h5>
			<svelte:fragment slot="subtitle">
				<small class="tile-subtitle text-gray">
					{showTimestamp(calculation)}
				</small>
			</svelte:fragment>
			<svelte:fragment slot="action">
				<IconButton icon="cross" on:click={() => delCalculation(calculation.id)} />
			</svelte:fragment>
		</Tile>
	{:else}
		<div class="text-center distant_msg">No calculations</div>
	{/each}
</Main>

<script lang="ts" context="module">
	import { onMount } from 'svelte';

	import { Tile, IconButton } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';

	import { getCalculations, delCalculation } from '@/services/api';

	import calculations from '@/stores/calculations';
	import { showTimestamp } from '@/helpers/date';
</script>

<script lang="ts">
	onMount(async () => {
		setTimeout(getCalculations);
	});
</script>
