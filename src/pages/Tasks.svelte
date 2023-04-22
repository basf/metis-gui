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
{#if dataSource}
	<TaskModal {dataSource} open={true} on:close={taskModalClosed} />
{/if}

<script lang="ts">
	import { Col, IconButton } from 'svelte-spectre';

	import { Main, Section } from '@/layouts';
	import { collectionsAsync, collectionDataSourcesAsync } from '@/stores/collections';
	import { Collection, DataSource } from '@/views/tiles';
	import { TaskModal } from '@/views/modals';

	let dataSources: number[] | undefined;
	function setDatasources(ids = undefined) {
		dataSources = ids;
	}

	let dataSource = null;
	function setDatasource(d) {
		dataSource = d;
	}

	function taskModalClosed() {
		dataSource = null;
	}
</script>
