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

	import { getDataSourcesByCollections } from '@/services/api';

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
		addOpen = false;

	let selected: Tag[] = [];

	$: predefined = $collections
		.filter((collection: Collection) => collection.userId === $user?.id)
		.map((collection: Collection) => ({
			id: collection.id,
			label: collection.title,
			group: collection.visibility,
			style: `background: ${collection.typeFlavor} !important`,
			value: collection.dataSources,
		}));

	$: selected = predefined.filter((tag) =>
		`${$query.params.collectionIds}`.includes(`${tag.id}`)
	);

	$: setCollectionIds(selected);

	function setCollectionIds(selected: Tag[]) {
		const collectionIds = selected.map((s) => s.id).join(',');
		$query.params.collectionIds = collectionIds || '';
		getDataSourcesByCollections(collectionIds);
	}
</script>
