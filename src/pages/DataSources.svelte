<Main>
	<Nodes asyncData={$datasourcesAsync}>
		<svelte:fragment let:item>
			<Col col="12">
				<DataSource datasource={item}>
					<TileTags datasourceId={item.id} />
					{#if $user?.id === item.userId}
						<TileMenu items={tileMenuItems(item.type)} dataId={item.id} />
					{/if}
				</DataSource>
			</Col>
		</svelte:fragment>
	</Nodes>
</Main>

<DataModal bind:dataId {dataName} />

<script lang="ts" context="module">
	import { fragment, query } from 'svelte-pathfinder';
	import { Col } from 'svelte-spectre';

	import { Main, Nodes } from '@/layouts/';
	import { DataSource } from '@/views/tiles';
	import { DataModal } from '@/views/modals';
	import { TileMenu, TileTags } from '@/components/Tile/';
	//import Sinus from '@/assets/img/sinus.svg'; // to use as *icon*

	import { delDataSource } from '@/services/api';

	import datasources, { datasourcesAsync } from '@/stores/datasources';
	import { withConfirm } from '@/stores/confirmator';
	import user from '@/stores/user';
	import { runCalculation } from '@/helpers/calculation';
</script>

<script lang="ts">
	const tileMenuItems = (type: number) => {
		const runCalc = {
				icon: 'forward',
				color: 'success',
				label: 'Calculate',
				action: runCalculation,
			},
			editCalc = {
				icon: 'edit',
				color: 'success',
				label: 'Edit calculation input',
				action: editCalculation,
			},
			editTag = {
				icon: 'tag',
				label: 'Edit Tags',
				action: editTags,
			},
			visRes = {
				icon: 'download',
				label: 'View Data',
				action: visData,
			},
			viewRes = {
				icon: 'download',
				label: 'View Data',
				action: viewData,
			},
			refineRes = {
				icon: 'search',
				label: 'Identify Phase',
				action: function(){},
			},
			deleteData = {
				icon: 'cross',
				color: 'error',
				label: 'Delete',
				action: delData,
				query: $query.toString(),
			};

		switch(type){
			case 1: return [runCalc, editCalc, editTag, visRes, deleteData];
			case 3: return [viewRes, deleteData];
			case 5: return [refineRes, viewRes, deleteData];
			default: return [deleteData];
		}
	};

	let dataId = '';

	$: dataName = $datasources.data.find((data) => data.id === +dataId)?.name;

	async function editCalculation(id: number) {
		$fragment = `#edit-calculation-${id}`;
	}

	function editTags(id: number) {
		$fragment = `#edit-tags-${id}`;
	}

	function viewData(id: number) {
		$fragment = `#view-data-${id}`;
	}

	function visData(id: number) {
		$fragment = `#view-vis-${id}`;
	}

	function delData(id: number, query: string) {
		withConfirm(
			delDataSource,
			{ id, query },
			'Really delete this item?',
			false
		)?.({ id, query });
	}
</script>
