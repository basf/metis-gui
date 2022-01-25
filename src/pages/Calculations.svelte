<Main>
	{#each $calculations as calculation (calculation.id)}
		<Tile>
			<IconButton slot="icon" icon="edit" on:click={() => (open = !open)} />
			<h5 slot="title" class="mt-2">{@html calculation.name}</h5>
			<small slot="subtitle" class="tile-subtitle text-gray">
				{showTimestamp(calculation)}
			</small>
			<IconButton
				slot="action"
				icon="cross"
				on:click={() => delCalculation(calculation.id)}
			/>
		</Tile>
	{:else}
		<div class="text-center distant_msg">No calculations</div>
	{/each}
</Main>

<Modal bind:open size="fs">
	<h3 slot="header">Modal header</h3>
	<div class="content">Modal content</div>
	<p slot="footer">Modal footer</p>
</Modal>

<script lang="ts" context="module">
	import { onMount } from 'svelte';

	import { IconButton, Modal, Tile } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';

	import { getCalculations, delCalculation } from '@/services/api';

	import calculations from '@/stores/calculations';
	import { showTimestamp } from '@/helpers/date';
</script>

<script lang="ts">
	let open = false; // temp variable for example

	onMount(async () => {
		setTimeout(getCalculations);
	});
</script>
