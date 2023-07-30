<Modal size="fs" bind:open on:close={closeModal}>
	<div class="content">
		<p>
			<PeriodicTable bind:selected bind:clear/>
		</p>
		<p class="periodic_table_input">
			<Autocomplete {predefined} bind:selected placeholder="Type or select up to 3 elements" />
			&nbsp;
			<Checkbox bind:value={strict}> only selected</Checkbox>
		</p>
	</div>

	<Container size="sm">
		<div class="bg-primary{$media.dark && '-darked'} mt-2 text-center">
			<Button size="md" variant="success" on:click={submitPI} disabled={disableSubmit}>Submit</Button>
			<Button size="md" variant="error" on:click={closeModal}>Cancel</Button>
		</div>
	</Container>
</Modal>

<script lang="ts" context="module">
	import { Modal, Button, Container, PeriodicTable, Autocomplete, Checkbox } from 'svelte-spectre';
	import ptable_data from 'svelte-spectre/package/components/PeriodicTable/chemical_content.json';

	import { media } from '@/stores/media';
	import { createEventDispatcher } from 'svelte';
</script>

<script lang="ts">
	export let targetDS: number;
	export let open: boolean = false;

	let strict: boolean = true;

	let clear;
	let selected: string[] = [];
	let predefined: string[] = [];

	for (const [key, value] of Object.entries(ptable_data)) {
		value.forEach(v => predefined.push(v))
		predefined.push(key)
	}

	$: disableSubmit = !selected.length;

	const dispatch = createEventDispatcher();

	function closeModal() {
		open = false;
		dispatch('close');
	}

	function submitPI() {
		let els = [];
		selected.forEach(item => els.push(item.value));
		els = els.join('-');
		selected.length && dispatch('submitpi', {targetDS, els, strict});
	}

	$: if (selected.length > 3) { // control select count
		selected.pop();
	} else {
		let counts = {};
		selected.map(item => item.label.length > 2).forEach(x => counts[x] = (counts[x] || 0) + 1);
		if (counts["true"] > 2){
			selected.pop()
		}
	}
</script>

<style>
	.periodic_table_input {
		display: flex;
		justify-content: center;
		width: 100%;
	}
</style>

