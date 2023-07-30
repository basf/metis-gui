<Modal size="fs" bind:open on:close={closeModal}>
	<div class="top_left_corner">
		<IconButton icon="back" size="xxl" on:click={previous} />
	</div>
	{#if !result}
		<div class="h_spacer"></div>
		<Loaders.Circle big />
	{:else}
		<div class="distant_msg"></div>
		<Grid oneline>
			{#each result as { src, entry, name }, num}
				<Col col="4">
					<Card pos="top">
						<img class="img-responsive" src="{src}" alt="{entry}" slot="img" />
						<div slot="title" class="h5">{@html name}</div>
						<div slot="subtitle" class="text-gray">ID &bull; {entry} / match #{num + 1}</div>
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

	import { setPI } from '@/services/api';
	import type { HttpError } from '@/services/api';

	export let paramsPI: {id: number, els: string, strict: boolean};
	export let open: boolean = false;

	let result = false;

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
		} catch (e) {
			toast.error({ msg: (err as HttpError).message, timeout: 2500, pos: 'top_right' });
		}
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
