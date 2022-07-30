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
					options={optionsVisibility}
					bind:value={$query.params.visibility}
					placeholder="Visibility"
					size="lg"
				/>
				<Select
					options={optionsTypes}
					bind:value={$query.params.type}
					placeholder="Type"
					size="lg"
				/>
			</InputGroup>
		</Col>
	</Grid>
</div>

<script lang="ts" context="module">
	import { pattern, query, type Param, type Params } from 'svelte-pathfinder';
	import { Autocomplete, Col, Grid, IconButton, InputGroup, Select } from 'svelte-spectre';
	import { VISIBILITY } from '@/types/const';
	import filters from '@/stores/filters';

	import type { Collection, CollectionType } from '@/types/dto';

	type Tag = {
		index: number;
		label: string;
		group: string;
		style: string;
		value?: number[];
		type: number;
	};
</script>

<script lang="ts">
	export let add = true;
	export let icon = 'plus';
	export let tooltip = 'Add structure';
	export let action = () => {};

	let selected: Tag[] = [];
	let predefined: Tag[] = [];

	$: predefined = getPredefined($filters.data, $query.params);
	$: if (predefined.length) selected = getSelected($query.params.collectionIds);
	$: optionsVisibility = getVisibilityOptions(selected, $query.params.type);
	$: optionsTypes = getTypeOptions($filters.types, selected, $query.params.visibility);

	function getPredefined(collections: Collection[], params: Params): Tag[] {
		return collections
			.filter(({ dataSources }) => ($pattern('/') ? dataSources?.length : true))
			.map((collection: Collection) => ({
				index: collection.id,
				label: collection.title,
				group: collection.visibility,
				type: collection.typeId,
				style: `background: ${collection.typeFlavor} !important`,
				value: collection.dataSources,
			}))
			.filter((tag) => {
				const { type, visibility } = params;
				return type || visibility ? tag.type === type || tag.group === visibility : true;
			});
	}

	function getSelected(collectionIds: Param) {
		return predefined.filter((tag) => `${collectionIds}`.split(',').includes(`${tag.index}`));
	}

	function setCollectionIds({ detail: tag }) {
		const selectedIds = selected.map((s) => s.index).join(',');
		$query.params.collectionIds = selectedIds;
	}

	function getVisibilityOptions(tags: Tag[], typeId: Param) {
		const visibilitys = new Set([
			...$filters.data
				.filter((filter) => filter.typeId === typeId)
				.map(({ visibility }) => visibility),
		]);

		return VISIBILITY.filter((group) =>
			tags.length
				? selected.some((tag) => tag.group === group)
				: typeId
				? visibilitys.has(group)
				: true
		);
	}

	function getTypeOptions(types: CollectionType[], tags: Tag[], visibility: Params) {
		const optionsTypes = types
			.map(({ label, id: value }) => ({ label, value }))
			.filter(Boolean);

		const typeIds = new Set([
			...$filters.data
				.filter((filter) => filter.visibility === (visibility as unknown as string))
				.map(({ typeId }) => typeId),
		]);

		return optionsTypes.filter((type) =>
			tags.length
				? selected.some((tag) => tag.type === type.value)
				: visibility
				? typeIds.has(type.value)
				: true
		);
	}
</script>
