<Modal size="fs" bind:open on:close={closeModal}>
	<h3 slot="header">{@html dataSource?.name}</h3>
	{#if periodicTable}
		<div class="content periodic-table">
			<Autocomplete {predefined} bind:selected placeholder="Type or select up to 3 elements" />
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

	import calculations from '@/stores/calculations';
	import { runCalculation } from '@/helpers/calculation';

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
	async function startRefinement() {
		refinementStarted = true;
		const r = await runCalculation(dataSource.id);
		if (r) {
			const unsubcribe = calculations.subscribe((calc) => {
				if (calcIsReady(calc, dataSource.id)) {
					unsubcribe();
					periodicTable = false;
					refinementStarted = false;
				}
			});
		}
	}

	function calcIsReady(calc, id) {
		return (
			Array.isArray(calc.data) &&
			calc.data
				.filter(({ parent, parents }) => parent === id || parents.includes(id))
				.some(({ progress }) => progress === 100)
		);
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
