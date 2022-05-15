<Main>
	<div bind:clientWidth={width}>
		{#await $calculationsAsync}
			{#each { length: 4 } as _}
				<Loaders.Tile count={1} w={width} h={74} height={74} {width} />
			{/each}
		{:then calculations}
			{#each calculations as calculation (calculation.id)}
				<Tile centered={false}>
					<svelte:fragment slot="title">
						<h5 class="mt-2">{@html calculation.name}</h5>
					</svelte:fragment>
					<svelte:fragment slot="subtitle">
						<small class="text-gray">
							{showTimestamp(calculation)}
						</small>
					</svelte:fragment>
					<Meter
						value={calculation.progress}
						striped={calculation.progress < 100}
						animated={calculation.progress < 100}
					/>
					<svelte:fragment slot="action">
						<IconButton
							icon="cross"
							color="error"
							on:click={() =>
								withConfirm(
									delCalculation,
									calculation.id,
									'Are you sure?',
									false
								)?.(calculation.id)}
						/>
					</svelte:fragment>
				</Tile>
			{:else}
				<div class="text-center distant_msg">No calculations</div>
			{/each}
		{/await}
	</div>
</Main>

<script lang="ts" context="module">
	import { IconButton, Tile } from 'svelte-spectre';
	import { Meter } from 'svelte-spectre/package/components/Meter/index';

	import Main from '@/layouts/Main.svelte';
	import * as Loaders from '@/components/loaders';

	import { delCalculation } from '@/services/api';

	import { calculationsAsync } from '@/stores/calculations';
	import { withConfirm } from '@/stores/confirmator';
	import { showTimestamp } from '@/helpers/date';
</script>

<script lang="ts">
	let width: number;
</script>
