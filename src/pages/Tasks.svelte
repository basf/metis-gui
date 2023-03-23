<Main>
	{#if !dataSources}
		<Section asyncData={$collectionsAsync}>
			<svelte:fragment let:item>
				{#if item.typeFlavor === 'red'}
					<Col col="12">
						<Collection
							id="{item.id},"
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
								on:click={() => showDatasources(item.dataSources)}
							/>
						</Collection>
					</Col>
				{/if}
			</svelte:fragment>
		</Section>
	{:else}
		<Section asyncData={$collectionDataSourcesAsync}>
			<svelte:fragment let:item>
				{#if dataSources?.includes(item.id)}
					<Col col="12">
						<DataSource datasource={item} />
					</Col>
				{/if}
			</svelte:fragment>
		</Section>
	{/if}
</Main>

<script lang="ts">
	import { Col } from 'svelte-spectre';

	import { Main, Section } from '@/layouts';
	import { collectionsAsync, collectionDataSourcesAsync } from '@/stores/collections';
	import { Collection, DataSource } from '@/views/tiles';
	import { IconButton } from 'svelte-spectre';

	let dataSources: number[] | undefined;
	function showDatasources(ids) {
		dataSources = ids;
	}
</script>
