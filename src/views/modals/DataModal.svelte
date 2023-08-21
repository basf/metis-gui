<Modal
	title={dataType}
	size={modal().size || ($media.sm ? 'fs' : 'lg')}
	open={!!$fragment}
	on:close={closeModal}
>
	<h3 slot="header">
		{@html `${modal().header} <mark> ${dataName} </mark>`}
	</h3>
	<svelte:component
		this={modal().component}
		dataSourceId={+decodeURIComponent(dataId)}
		dataSourceName={dataName}
		bind:tags={tagIds}
		bind:input={calcInput}
	/>
	<svelte:fragment slot="footer">
		<Button on:click={closeModal}>Cancel</Button>
		<Button variant="primary" disabled={disableSubmit} on:click={modal().submit}>Submit</Button>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { fragment, query } from 'svelte-pathfinder';
	import { Button, Modal, toast } from 'svelte-spectre';

	import { CalculationEdit, EngineEdit, TagsEdit, DataView, DataIFrame } from '.';
	import { patchDataSourceCollections, setCalculation } from '@/services/api';
	import { media } from '@/stores/media';

	import { COMMON_POPUPS } from '@/config';
</script>

<script lang="ts">
	export let dataName = '';
	export let dataId = '';

	let calcInput = '';
	let tagIds: number[];

	$: disableSubmit = !engine;

	$: [_, dataType, dataId, engine] = $fragment.split('-');

	$: modal = () => {
		switch (dataType) {
			case 'engine':
				return {
					header: 'Select calculation engine for',
					component: EngineEdit,
					submit: submitCalculation,
					size: 'md',
				};
			case 'calculation':
				return {
					header: 'Edit and submit calculation for',
					component: CalculationEdit,
					submit: submitCalculation,
				};
			case 'tags':
				return {
					header: 'Edit and submit tags for',
					component: TagsEdit,
					submit: submitTags,
				};
			case 'data':
				return {
					header: 'View',
					component: DataView,
					submit: submitData,
				};
			case 'vis':
				return {
					header: 'View',
					component: DataIFrame,
					submit: () => {},
					size: 'lg',
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
			input: calcInput,
			workflow: 'unused',
			query: $query.toString(),
		}).then(() => {
			closeModal();
			toast.success({
				msg: COMMON_POPUPS['add_calc'],
				timeout: 2000,
				pos: 'top_right',
				icon: 'check',
			});
		});
	}

	function submitTags() {
		patchDataSourceCollections(+dataId, tagIds).then(closeModal);
	}

	function submitData() {
		closeModal();
	}
</script>
