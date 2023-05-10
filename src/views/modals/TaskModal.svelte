<Modal size="fs" bind:open on:close={closeModal}>
	<h3 slot="header">{@html dataSource?.name}</h3>
	{#if periodicTable}
		<div class="content periodic-table">
			<Autocomplete {predefined} bind:selected placeholder="Type or select 3 elements" />
			<PeriodicTable bind:selected bind:clear />
			<div class="buttons">
				<Button size="md" loading={refinementStarted} on:click={startRefinement}
					>Start refinement</Button
				>
			</div>
		</div>
	{:else}
		<div class="content">
			<DataView dataSourceId={dataSource?.id} />
		</div>
	{/if}
	<p slot="footer">
		<Button size="md" on:click={showPeriodicTable}>Show Periodic Table</Button>
		<Button size="md" on:click={closeModal}>Close</Button>
	</p>
</Modal>

<script lang="ts">
	import { Modal, Button, PeriodicTable, Autocomplete } from 'svelte-spectre';
	import elements from 'svelte-spectre/package/components/PeriodicTable/chemical_content.json';

	import { DataView } from '@/views/modals';
	import { createEventDispatcher } from 'svelte';

	import { fragment, query } from 'svelte-pathfinder';
	import { toast } from 'svelte-spectre';
	import { engines } from '@/stores/calculations';
	import { setCalculation } from '@/services/api';

	export let dataSource;
	export let open = false;

	const dispatch = createEventDispatcher();

	function closeModal() {
		open = false;
		dispatch('close');
	}

	let clear;
	let selected = [];
	let predefined = Object.entries(elements).flat(2);
	let periodicTable = false;
	function showPeriodicTable() {
		periodicTable = true;
	}

	let refinementStarted = false;
	function startRefinement() {
		refinementStarted = true;
		runCalculation(dataSource.id);
	}

	// a copy from DataSource.svelte
	async function runCalculation(id: number) {
		if ($engines.length > 1) {
			$fragment = `#edit-engine-${id}`;
		} else {
			const { reqId } = await setCalculation({
				dataId: id,
				engine: $engines[0],
				workflow: 'unused',
				query: $query.toString(),
			});
			console.log('reqId', reqId);
			toast.success({
				msg: 'Calculation submitted',
				timeout: 2000,
				pos: 'top_right',
				icon: 'forward',
			});
		}
	}
</script>

<style>
	.periodic-table {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.periodic-table .buttons {
		display: flex;
		justify-content: right;
	}
</style>
