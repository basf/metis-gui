<Modal size={modal().size || ($media.sm ? 'fs' : 'lg')} open={!!$fragment} on:close={closeModal}>
	<h3 slot="header">
		{@const modalHeader = `Edit and submit ${decodeURIComponent(
			dataType
		)} for <mark> ${dataName} </mark>`}
		{@html modalHeader}
	</h3>
	{#if modal().component}
		<svelte:component
			this={modal().component}
			dataSourceId={+decodeURIComponent(dataId)}
			bind:tags={tagIds}
		/>
	{:else}
		<span style="height: 100%" class="loading loading-lg p-centered d-block" />
	{/if}
	<svelte:fragment slot="footer">
		<Button on:click={closeModal}>Cancel</Button>
		<Button variant="primary" on:click={modal().submit}>Submit</Button>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { fragment } from 'svelte-pathfinder';
	import { Button, Modal, toast } from 'svelte-spectre';

	import { CalculationEdit, EnginesEdit, PlotEdit, TagsEdit } from '.';
	import { patchDataSourceCollections, setCalculation } from '@/services/api';
	import { editorCode } from '@/stores/editor';
	import { media } from '@/stores/media';
</script>

<script lang="ts">
	export let data;

	let tagIds;

	$: [_, dataType, dataId, engine] = $fragment.split('-');

	$: dataName = data?.find((data) => data.id === +dataId)?.name;

	$: modal = () => {
		switch (dataType) {
			case 'engine':
				return {
					component: EnginesEdit,
					submit: submitEngines,
					size: 'md',
				};
			case 'calculation':
				return {
					component: CalculationEdit,
					submit: submitCalculation,
				};
			case 'tags':
				return {
					component: TagsEdit,
					submit: submitTags,
				};
			case 'plot':
				return {
					component: PlotEdit,
					submit: submitPlots,
				};
			default:
				return {
					component: undefined,
					submit: () => {},
				};
		}
	};

	function closeModal() {
		$fragment = '';
	}

	function submitCalculation() {
		setCalculation({ dataId: +dataId, engine, input: $editorCode.input }).then(() =>
			closeModal()
		);
	}

	async function submitTags() {
		await patchDataSourceCollections(+dataId, tagIds).then(() => closeModal());
	}

	function submitPlots() {
		closeModal();
	}

	function submitEngines() {
		setCalculation({
			dataId: +dataId,
			engine,
			input: '',
			workflow: 'workflow',
		}).then(() => {
			closeModal();
			toast.success({
				msg: 'Calculation submitted',
				timeout: 2000,
				pos: 'top_right',
				icon: 'forward',
			});
		});
	}
</script>
