<div class="py-2">
	<Grid>
		{#if add}
			<Col col="auto">
				<IconButton size="lg" {icon} variant="default" {tooltip} on:click={action} />
			</Col>
		{/if}
		<Col>
			<InputGroup>
				<Autocomplete
					{predefined}
					bind:selected
					on:select={setCollectionIds}
					on:remove={setCollectionIds}
					placeholder="Filter by tags title"
					style="flex: 400%;"
				/>
				<Select
					options={VISIBILITY}
					bind:value={$query.params.visibility}
					placeholder="Visibility"
					size="lg"
				/>
				<Select
					options={getTypeOptions($filters.types)}
					bind:value={$query.params.type}
					placeholder="Type"
					size="lg"
				/>
			</InputGroup>
		</Col>
	</Grid>
</div>

<script lang="ts" context="module">
	import { Param, query } from 'svelte-pathfinder';
	import { Autocomplete, Col, Grid, IconButton, InputGroup, Select } from 'svelte-spectre';
	import { VISIBILITY } from '@/types/const';

	import type { Collection, CollectionType } from '@/types/dto';
	import { onMount } from 'svelte';
	import { getFilters } from '@/services/api';
	import filters from '@/stores/filters';

	type Tag = {
		index: number;
		label: string;
		group: string;
		style: string;
		value?: number[];
	};
</script>

<script lang="ts">
	export let add = true,
		icon = 'plus',
		tooltip = 'Add structure',
		action = () => {};

	let selected: Tag[] = [],
		predefined: Tag[] = [];

	onMount(getFilters);

	$: {
		predefined = getPredefined($filters.data);
		selected = getSelected($query.params.collectionIds);
	}

	function getPredefined(collections: Collection[]): Tag[] {
		return collections?.map((collection: Collection) => ({
			index: collection.id,
			label: collection.title,
			group: collection.visibility,
			style: `background: ${collection.typeFlavor} !important`,
			value: collection.dataSources,
		}));
	}

	function getSelected(collectionIds: Param) {
		return predefined.filter((tag) => `${collectionIds}`.split(',').includes(`${tag.index}`));
	}

	function setCollectionIds(e: { detail: Tag[] }) {
		const collectionIds = selected.map((s) => s.index).join(',');
		$query.params.collectionIds = collectionIds;
	}

	function getTypeOptions(types: CollectionType[]) {
		return types.map(({ label, slug: value }) => ({ label, value })).filter(Boolean);
	}
</script>
