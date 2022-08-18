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
		<Button variant="primary" on:click={modal().submit}>Submit</Button>
	</svelte:fragment>
</Modal>

<script lang="ts" context="module">
	import { fragment } from 'svelte-pathfinder';
	import { Button, Modal, toast } from 'svelte-spectre';

	import { CalculationEdit, EngineEdit, DataView, TagsEdit } from '.';
	import { patchDataSourceCollections, setCalculation } from '@/services/api';
	import { media } from '@/stores/media';
</script>

<script lang="ts">
	export let dataName = '';
	export let dataId = '';

	let calcInput = '';
	let tagIds: number[];

	$: [_, dataType, dataId, engine] = $fragment.split('-');

	$: modal = () => {
		switch (dataType) {
			case 'engine':
				return {
					header: `Select calculation engine for`,
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
					header: `View datasource`,
					component: DataView,
					submit: submitData,
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

	function submitData() {
		closeModal();
	}
</script>
