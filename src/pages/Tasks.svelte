<Main>
	{#if !dataSources}
		<Section asyncData={$collectionsAsync}>
			<svelte:fragment let:item>
				{#if item.typeFlavor === 'red'}
					<Col col="12">
						<Collection
							id={item.id}
							title={item.title}
							description={item.description}
							visibility={item.visibility}
							userId={item.userId}
							userFirstName={item.userFirstName}
							userLastName={item.userLastName}
							typeFlavor={item.typeFlavor}
						>
							<IconButton
								icon="forward"
								slot="action"
								on:click={() => setDatasources(item.dataSources)}
							/>
						</Collection>
					</Col>
				{/if}
			</svelte:fragment>
		</Section>
	{:else}
		<Section asyncData={$collectionDataSourcesAsync}>
			<div slot="filter">
				<IconButton icon="back" on:click={() => setDatasources()} />
			</div>
			<svelte:fragment let:item>
				{#if dataSources?.includes(item.id)}
					<Col col="12">
						<DataSource datasource={item}>
							<IconButton
								icon="edit"
								on:click={() => {
									console.log('click datasource', item);
									setDatasource(item);
								}}
							/>
						</DataSource>
					</Col>
				{/if}
			</svelte:fragment>
		</Section>
	{/if}
</Main>
<Modal size="fs" bind:open>
	<h3 slot="header">{@html dataSource?.name}</h3>
	{#if periodicTable}
		<div class="content">
			<PeriodicTable />
		</div>
	{:else}
		<div class="content">
			<DataView dataSourceId={dataSource?.id} />
		</div>
	{/if}
	<p slot="footer">
		<Button size="md" on:click={showPeriodicTable}>Show Periodic Table</Button>
		<Button size="md" on:click={closeModal}>Close</Button>
	</p>
</Modal>

<script lang="ts">
	import { Col, IconButton, Modal, Button, PeriodicTable } from 'svelte-spectre';

	import { Main, Section } from '@/layouts';
	import { collectionsAsync, collectionDataSourcesAsync } from '@/stores/collections';
	import { Collection, DataSource } from '@/views/tiles';
	import { DataView } from '@/views/modals';

	let dataSources: number[] | undefined;
	function setDatasources(ids = undefined) {
		dataSources = ids;
	}

	let open = false;
	function closeModal() {
		open = false;
	}

	let dataSource;
	function setDatasource(d) {
		dataSource = d;
		open = true;
	}

	let periodicTable = false;
	function showPeriodicTable() {
		periodicTable = true;
	}
</script>
