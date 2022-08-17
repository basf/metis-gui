<Main>
	<Section asyncData={$datasourcesAsync}>
		<svelte:fragment slot="add" let:add>
			{#if add || !$datasources.total}
				<Col col="12">
					<DataSourceAdd msg={!$datasources.total} />
				</Col>
			{/if}
		</svelte:fragment>
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

<DataModal data={$datasources.data} />

<script lang="ts" context="module">
	import { fragment, query } from 'svelte-pathfinder';
	import { Col } from 'svelte-spectre';

	import { Main, Section } from '@/layouts/';
	import { DataSource } from '@/views/tiles';
	import { DataSourceAdd } from '@/views/DataSource';
	import { DataModal } from '@/views/modals';
	import { TileMenu, TileTags } from '@/components/Tile/';
	import Sinus from '@/assets/img/sinus.svg';

	import { delDataSource, setCalculation } from '@/services/api';

	import datasources, { datasourcesAsync } from '@/stores/datasources';
	import { withConfirm } from '@/stores/confirmator';
	import { engines } from '@/stores/calculations';
	import user from '@/stores/user';
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
				label: 'Edit Calculation',
				action: editCalculation,
			},
			editTag = {
				icon: 'tag',
				label: 'Edit Tags',
				action: editTags,
			},
			editPlot = {
				icon: Sinus,
				label: 'Edit Plot',
				action: editPlots,
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
			type === 3 ? editPlot : null,
			deleteData,
		].filter(Boolean);
	};

	async function editCalculation(id: number) {
		$fragment = `#edit-calculation-${id}`;
	}

	function editTags(id: number) {
		$fragment = `#edit-tags-${id}`;
	}

	function editPlots(id: number) {
		$fragment = `#edit-plot-${id}`;
	}

	function runCalculation(id: number) {
		if ($engines) {
			$fragment = `#edit-engine-${id}`;
		} else setCalculation({ dataId: id, workflow: 'unused' });
	}

	function delData(id: number, query: string) {
		withConfirm(delDataSource, { id, query }, 'Are you sure?', false)?.({ id, query });
	}
</script>
