<Modal size="fs" bind:open on:close={close}>
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

	export let dataSource;
	export let open = false;

	const dispatch = createEventDispatcher();

	function closeModal() {
		open = false;
		console.log('closed');
		dispatch('close');
	}

	let clear;
	let selected = [];
	let predefined = Object.entries(elements).flat(2);
	let periodicTable = false;
	function showPeriodicTable() {
		periodicTable = true;
	}

	$: console.log(selected);

	let refinementStarted = false;
	function startRefinement() {
		refinementStarted = true;
		console.log('start refinement');
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
