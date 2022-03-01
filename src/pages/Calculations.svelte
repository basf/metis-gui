<Main>
	{#each $calculations as calculation (calculation.id)}
		<Tile>
			<h5 slot="title" class="mt-2">{@html calculation.name}</h5>
			<small slot="subtitle" class="tile-subtitle text-gray">
				{showTimestamp(calculation)}
			</small>
			<svelte:fragment slot="action">
				<IconButton
					icon="cross"
					color="error"
					on:click={() => delCalculation(calculation.id)}
				/>
			</svelte:fragment>
		</Tile>
	{:else}
		<div class="text-center distant_msg">No calculations</div>
	{/each}
</Main>

<script lang="ts" context="module">
	import { IconButton, Tile, toast } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';

	import { getCalculations, delCalculation } from '@/services/api';

	import calculations from '@/stores/calculations';
	import user from '@/stores/user';
	import { showTimestamp } from '@/helpers/date';
</script>

<script lang="ts">
	$: $user && getCalculations();
	$: $calculations.length && toast.primary({ msg: 'Calculations synced', timeout: 2000, pos: 'top_right' });
</script>
