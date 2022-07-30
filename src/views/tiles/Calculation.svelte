<Tile centered={false}>
	<svelte:fragment slot="title">
		<h5 class="mt-2">{@html calculation.name}</h5>
	</svelte:fragment>
	<svelte:fragment slot="subtitle">
		<small class="text-gray">
			Started {showTimestamp(calculation)}
		</small>
	</svelte:fragment>
	<Meter
		progress
		value={calculation.progress}
		striped={calculation.progress < 100}
		animated={calculation.progress < 100}
	/>
</Tile>

<script lang="ts" context="module">
	import { IconButton, Meter, Tile } from 'svelte-spectre';

	import { delCalculation } from '@/services/api';

	import { withConfirm } from '@/stores/confirmator';
	import { showTimestamp } from '@/helpers/date';

	import type { Calculation as CalculationDTO } from '@/types/dto';
</script>

<script lang="ts">
	export let calculation: CalculationDTO;
</script>
