<Main>
	{#each $calculations as calculation (calculation.id)}
		<Tile>
			<h5 slot="title" class="mt-2">{@html calculation.name}</h5>
			<small slot="subtitle" class="tile-subtitle text-gray">
				{showTimestamp(calculation)}
			</small>
			<svelte:fragment slot="action">
				<IconButton icon="cross" color="error" on:click={() => delCalculation(calculation.id)} />
			</svelte:fragment>
		</Tile>
	{:else}
		<div class="text-center distant_msg">No calculations</div>
	{/each}
</Main>

<script lang="ts" context="module">
	import { onMount } from 'svelte';

	import { IconButton, Tile } from 'svelte-spectre';

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
