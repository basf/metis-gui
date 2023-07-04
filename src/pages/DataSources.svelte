<Main>
	<Section asyncData={$datasourcesAsync}>
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
	</Section>
</Main>

<DataModal bind:dataId {dataName} />

<script lang="ts" context="module">
	import { fragment, query } from 'svelte-pathfinder';
	import { Col } from 'svelte-spectre';

	import { Main, Section } from '@/layouts/';
	import { DataSource } from '@/views/tiles';
	import { DataModal } from '@/views/modals';
	import { TileMenu, TileTags } from '@/components/Tile/';
	import Sinus from '@/assets/img/sinus.svg';

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
			viewRes = {
				icon: Sinus,
				label: 'View Data',
				action: viewData,
			},
			deleteData = {
				icon: 'cross',
				color: 'error',
				label: 'Delete',
				action: delData,
				query: $query.toString(),
			};

		return [
			type === 1 ? runCalc : null,
			type === 1 ? editCalc : null,
			type === 1 ? editTag : null,
			type === 3 || type === 5 ? viewRes : null,
			deleteData,
		].filter(Boolean);
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

	function delData(id: number, query: string) {
		withConfirm(
			delDataSource,
			{ id, query },
			'Really delete this item?',
			false
		)?.({ id, query });
	}
</script>
