<Modal size="fs" bind:open on:close={closeModal}>
	<div class="top_left_corner">
		<IconButton icon="back" size="xxl" on:click={previous} />
	</div>
	{#if !result}
		<div class="h_spacer"></div>
		<Loaders.Circle big />
	{:else if result.error}
		<div class="distant_msg"></div>
		<div class="text-center">{result.error}</div>
	{:else}
		<div class="distant_msg"></div>
		<Grid oneline>
			{#each result as { src, entry, name }, num}
				<Col col="4">
					<Card pos="top">
						<img class="img-responsive" src="{src}" alt="{entry}" slot="img" />
						<div slot="title" class="h5">{@html name}</div>
						<div slot="subtitle" class="text-gray">ID &bull; {entry} &bull; match #{num + 1}</div>
						<svelte:fragment slot="footer">
							<Button variant="primary" on:click={importDS(entry)} disabled={added.includes(entry)}>Add</Button>
						</svelte:fragment>
					</Card>
					<div class="distant_msg"></div>
				</Col>
			{/each}
		</Grid>
	{/if}
</Modal>

<script lang="ts">
	import * as Loaders from '@/components/loaders';
	import { Modal, Button, Card, Col, Grid, IconButton, toast } from 'svelte-spectre';
	import { createEventDispatcher } from 'svelte';

	import { setPI, importDataSource } from '@/services/api';
	import type { HttpError } from '@/services/api';

	import { COMMON_POPUPS } from '@/config';

	export let paramsPI: {id: number, els: string, strict: boolean};
	export let open: boolean = false;

	let result: any = false;
	let added: string[] = [];

	submitPI();

	const dispatch = createEventDispatcher();

	function closeModal() {
		open = false;
		dispatch('close');
	}

	function previous() {
		open = false;
		dispatch('previous', {targetDS: paramsPI.id});
	}

	async function submitPI() {
		try {
			result = await setPI(paramsPI.id, paramsPI.els, paramsPI.strict);
		} catch (error) {
			toast.error({ msg: (error as HttpError).message, timeout: 2500, pos: 'top_center' });
		}
	}

	function importDS(entry) {
		added.push(entry);
		added = [...added];
		importDataSource(entry, paramsPI.id);

		toast.primary({
			msg: COMMON_POPUPS['add_data'],
			timeout: 2500,
			pos: 'top_center',
			icon: 'check',
		});
	}
</script>

<style>
	.top_left_corner {
		position: fixed;
		top: 15px;
		left: 15px;
	}
	.h_spacer {
		width:100%;
		height:33%;
	}
</style>
