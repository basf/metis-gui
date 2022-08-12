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
			bind:input
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
	import { media } from '@/stores/media';
</script>

<script lang="ts">
	export let dataName = '';
	export let dataId = '';

	let tagIds: number[];
	let input = '';

	$: [_, dataType, dataId, engine] = $fragment.split('-');

	$: modal = () => {
		switch (dataType) {
			case 'engine':
				return {
					component: EnginesEdit,
					submit: submitCalculation,
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
		setCalculation({
			dataId: +dataId,
			engine,
			input,
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

	function submitTags() {
		patchDataSourceCollections(+dataId, tagIds).then(closeModal);
	}

	function submitPlots() {
		closeModal();
	}
</script>
