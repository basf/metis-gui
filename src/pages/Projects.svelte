<Main>
	<div class="py-2">
		<Grid>
			<Col col="auto">
				<IconButton
					{size}
					icon="plus"
					variant="default"
					tooltip="Add collection"
					on:click={() => openEdit()}
				/>
			</Col>
			<Col>
				<InputGroup>
					<Autocomplete
						{predefined}
						bind:selected
						on:select={setCollectionIds}
						on:remove={setCollectionIds}
						placeholder="Filter by title"
						style="flex: 400%;"
					/>
					<Select
						options={VISIBILITY}
						placeholder="Visibility"
						bind:value={$query.params.visibility}
						{size}
					/>
					<AsyncSelect
						data={$typesAsync}
						getOptions={getTypeOptions}
						bind:value={$query.params.type}
						placeholder="Type"
						{size}
					/>
				</InputGroup>
			</Col>
		</Grid>
	</div>
	<div bind:clientWidth={width} class="py-2">
		<Grid stack>
			{#if !$status.hidden}
				{#await $collectionsAsync}
					{#each { length: 6 } as _}
						<Col col="auto">
							<Loaders.Tile
								count={1}
								w={width / 2 - 12}
								h={107}
								height={107}
								width={width / 2 - 12}
							/>
						</Col>
					{/each}
				{:then { data, total }}
					{#if total}
						<Col col="12">
							<Pagination
								bind:limit={$query.params.limit}
								bind:page={$query.params.page}
								limits={[10, 50, 100]}
								{total}
								rest={7}
							/>
						</Col>
					{/if}
					{#each data as collection (collection.id)}
						<Col col="6" xs="12">
							<Collection {...collection} on:edit={(e) => openEdit(e.detail.id)} />
						</Col>
					{/each}
				{/await}
			{/if}
		</Grid>
	</div>
</Main>

<!-- {#if $fragment} -->
<CollectionEditModal
	{...editCollection}
	open={!!$fragment}
	size={$media.sm ? 'fs' : 'lg'}
	on:save={saveCollection}
	on:remove={removeCollection}
	on:close={closeEdit}
/>

<!-- {/if} -->
<script lang="ts" context="module">
	import { query, fragment, Param } from 'svelte-pathfinder';
	import { media } from '@/stores/media';
	import status from '@/stores/status';

	import {
		Col,
		Grid,
		Select,
		IconButton,
		InputGroup,
		toast,
		Pagination,
		Autocomplete,
	} from 'svelte-spectre';

	import { Collection } from '@/views/tiles/';

	import user from '@/stores/user';
	import collections, { collectionsAsync, typesAsync } from '@/stores/collections';

	import { getCollections, setCollection, delCollection, getDataSources } from '@/services/api';
	import type { HttpError } from '@/services/api';

	import { VISIBILITY } from '@/types/const';

	import AsyncSelect from '@/components/AsyncSelect.svelte';
	import * as Loaders from '@/components/loaders';
	import Main from '@/layouts/Main.svelte';

	import CollectionEditModal from '@/views/modals/CollectionEdit.svelte';
	import type { Collection as CollectionDTO } from '@/types/dto';
	const size = 'lg';

	type Tag = {
		index: number;
		label: string;
		group: string;
		style: string;
		value?: number[];
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let width: number,
		selected: Tag[] = [],
		predefined: Tag[] = [];

	$: if ($collections?.data?.length) predefined = getPredefined($collections.data);
	$: if (predefined.length) selected = getSelected($query.params.collectionIds);

	function getPredefined(collections: CollectionDTO[]): Tag[] {
		return collections.map((collection: CollectionDTO) => ({
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
	onMount(() => {
		getDataSources();
		$query.params.page ??= 1;
		$query.params.limit ??= 10;
	});

	$: if ($query.params.page && $query.params.limit) getCollections($query);

	$: editCollectionId = $fragment.replace('#', '');
	$: editCollection = $collections?.data?.find(
		(collection) => collection.id === +editCollectionId && collection.userId === $user?.id
	);

	function openEdit(id = '') {
		$fragment = '#' + id;
	}

	function closeEdit() {
		$fragment = '';
	}

	async function saveCollection({ detail }) {
		try {
			await setCollection(detail);
		} catch (err: unknown) {
			toast.error({ msg: (err as HttpError).message, timeout: 2000, pos: 'top_right' });
		}
		closeEdit();
	}

	async function removeCollection({ detail }) {
		try {
			await delCollection(detail.id);
		} catch (err: unknown) {
			toast.error({ msg: (err as HttpError).message, timeout: 2000, pos: 'top_right' });
		}
		closeEdit();
	}

	function getTypeOptions(types) {
		return types
			.filter(({ id }) => $collections?.data?.some(({ typeId }) => typeId === id))
			.map(({ label, slug: value }) => ({ label, value }));
	}
</script>

<style lang="scss">
	@media (max-width: 480px) {
		:global(.spectre .input-group) {
			flex-flow: row wrap;
		}
	}
</style>
