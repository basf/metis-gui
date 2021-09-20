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
		<div class="text-center m-2 p-2">Upload a structure to start...</div>
	{/each}
	<Grid class="mb-2 mt-2">
		<Col>
			<Input
				rows={4}
				placeholder="Paste POSCAR, CIF, or Optimade JSON"
				bind:value={content}
			/>
		</Col>
		<div class="divider-vert" data-content="OR" />
		<Col>
			<Upload />
		</Col>
	</Grid>
	<Button variant="primary" block disabled={dataCalc.length >= 5} on:click={addDataItem}>
		Add structure
	</Button>
</Main>

<script>
	import { onMount } from 'svelte';

	import { Tile, Button, IconButton, Progress, Input, Grid, Col } from 'svelte-spectre';

	import Main from '@/layouts/Main.svelte';

	import {
		getData,
		setData,
		delData,
		getCalculations,
		setCalculation,
		delCalculation,
	} from '@/services/api';

	import data from '@/stores/data';
	import errors from '@/stores/errors';

	import calculations from '@/stores/calculations';

	import Upload from '@/components/Upload.svelte';

	$: dataCalc = $data.map((item) => {
		if (item.error) errors.append(new Error(item.error));
		item.calculation = $calculations.find((calc) => calc.data === item.uuid);
		item.inProgress = item.calculation && item.calculation.progress < 100;
		console.log(item);
		return item;
	});

	$: (async () => {
		const copiedContent = await navigator.clipboard.readText();
		if (copiedContent) {
			content = copiedContent;
			navigator.clipboard.writeText('');
		}
	})();

	let content;

	onMount(async () => {
		setTimeout(() => {
			getData();
			getCalculations();
		});
	});

	function addDataItem() {
		setData(content);
		content = '';
	}
</script>
