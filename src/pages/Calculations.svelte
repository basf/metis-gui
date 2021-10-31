<Main>
	{#each dataCalc as item, i (item.uuid)}
		{#if !item.error}
			<Tile>
				<h5 class="mt-2" slot="title">{@html item.name}</h5>
				<svelte:fragment slot="subtitle">
					{#if item.inProgress}
						<Progress value={item.calculation.progress} />
					{:else}
						<small class="tile-subtitle text-gray"
							>Type &bull; {item.type} &bull; {new Date().toLocaleTimeString()}</small
						>
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="action">
					{#if item.inProgress}
						<IconButton
							icon="stop"
							on:click={() => delCalculation(item.calculation.uuid)}
						/>
					{:else}
						<IconButton icon="forward" on:click={() => setCalculation(item.uuid)} />
					{/if}
					<IconButton icon="cross" on:click={() => delData(item.uuid)} />
				</svelte:fragment>
			</Tile>
		{/if}
	{:else}
		<div class="text-center distant_msg">Upload a structure to start...</div>
	{/each}
	<Grid offset="my-2" align="">
		<Col>
			<Input
				rows={4}
				placeholder="Paste POSCAR, CIF, or Optimade JSON"
				bind:value={$content}
			/>
		</Col>
		<Divider align="vertical" text="OR" />
		<Col>
			<Upload />
		</Col>
	</Grid>
	<Button variant="primary" block disabled={dataCalc.length >= 5} on:click={addDataItem}>
		Add structure
	</Button>
</Main>

<script lang="ts">
	import { onMount } from 'svelte';

	import {
		Tile,
		Button,
		Divider,
		IconButton,
		Progress,
		Input,
		Grid,
		Col,
		toast,
	} from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';

	import {
		getData,
		setData,
		delData,
		getCalculations,
		setCalculation,
		delCalculation,
	} from '@/services/api';

	import data, { content } from '@/stores/data';

	import calculations from '@/stores/calculations';

	import Upload from '@/components/Upload.svelte';

	$: dataCalc = $data.map((item) => {
		if (item.error) toast.error({ msg: new Error(item.error), timeout: 4000 });

		item.calculation = $calculations.find((calc) => calc.data === item.uuid);
		item.inProgress = item.calculation && item.calculation.progress < 100;
		return item;
	});

	onMount(async () => {
		setTimeout(() => {
			getData();
			getCalculations();
		});
	});

	function addDataItem() {
		setData($content);
		$content = '';
	}
</script>
