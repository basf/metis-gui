{#if data.length}
	<div class="py-2">
		<Grid>
			{#if add}
				<Col col="auto">
					<IconButton
						size="lg"
						icon={addOpen ? 'minus' : 'plus'}
						variant="default"
						tooltip="Add structure"
						on:click={() => (addOpen = !addOpen)}
					/>
				</Col>
			{/if}
			<Col>
				<Autocomplete {predefined} bind:selected placeholder="Filter by tags" />
			</Col>
		</Grid>
	</div>
{/if}

<script lang="ts" context="module">
	import { query } from 'svelte-pathfinder';
	import { Autocomplete, Col, Grid, IconButton } from 'svelte-spectre';
	import collections from '@/stores/collections';
	import user from '@/stores/user';

	import { getDataSources, getDataSourcesByCollections } from '@/services/api';

	import type { Collection } from '@/types/dto';

	type Tag = {
		id: number;
		label: string;
		group: string;
		style: string;
		value?: number[];
	};
</script>

<script lang="ts">
	export let data: any[] = [],
		add = false,
		addOpen = false,
		selected: Tag[] = [];

	$: predefined = $collections
		.filter((collection: Collection) => collection.userId === $user?.id)
		.map((collection: Collection) => ({
			id: collection.id,
			label: collection.title,
			group: collection.visibility,
			style: `background: ${collection.typeFlavor} !important`,
			value: collection.dataSources,
		}));

	$: selected = predefined.filter((tag) => $query.params.collections?.includes(tag.id));

	$: filterDataSourcesBySelectedCollections(selected);

	function filterDataSourcesBySelectedCollections(selected: Tag[]) {
		if (selected.length) {
			const collectionIds = selected.map((s) => s.id) || [];
			$query.params.collections = collectionIds.join(',');
			getDataSourcesByCollections(collectionIds);
		} else {
			$query.params.collections = '';
			getDataSources();
		}
	}
</script>
