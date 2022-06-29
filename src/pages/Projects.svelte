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
					<Input
						bind:value={$query.params.title}
						placeholder="Filter by title"
						type="search"
						width="6"
						inline
						{size}
					>
						<span slot="iconRight">
							{#if $query.params.title}
								<IconButton
									type="button"
									icon="cross"
									on:click={() => ($query.params.title = '')}
								/>
							{/if}
						</span>
					</Input>
					<Select
						options={VISIBILITY}
						placeholder="Filter by visibility"
						bind:value={$query.params.visibility}
						{size}
					/>
					<AsyncSelect
						data={$typesAsync}
						getOptions={getTypeOptions}
						bind:value={$query.params.type}
						placeholder="Filter by type"
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
				{:then _}
					{#each filtredCollections as collection (collection.id)}
						<Col col="6" xs="12">
							<Collection {...collection} on:edit={(e) => openEdit(e.detail.id)} />
						</Col>
					{/each}
				{/await}
			{/if}
		</Grid>
	</div>
</Main>

<CollectionEditModal
	{...editCollection}
	open={!!$fragment}
	size={$media.sm ? 'fs' : 'lg'}
	on:save={saveCollection}
	on:remove={removeCollection}
	on:close={closeEdit}
/>

<script lang="ts" context="module">
	import { query, fragment } from 'svelte-pathfinder';
	import { media } from '@/stores/media';
	import status from '@/stores/status';

	import { Col, Grid, Input, Select, IconButton, InputGroup, toast } from 'svelte-spectre';

	import { Collection } from '@/views/tiles/';

	import user from '@/stores/user';
	import collections, { collectionsAsync, typesAsync } from '@/stores/collections';

	import { setCollection, delCollection } from '@/services/api';
	import type { HttpError } from '@/services/api';

	import { VISIBILITY } from '@/types/const';

	import AsyncSelect from '@/components/AsyncSelect.svelte';
	import * as Loaders from '@/components/loaders';
	import Main from '@/layouts/Main.svelte';

	import CollectionEditModal from '@/views/modals/CollectionEdit.svelte';

	const size = 'lg';
</script>

<script lang="ts">
	let width: number;

	$: filtredCollections = $collections.filter((collection) => {
		return (
			(!$query.params.title || collection.title.includes($query.params.title as string)) &&
			(!$query.params.visibility || collection.visibility === $query.params.visibility) &&
			(!$query.params.type || collection.typeSlug === $query.params.type)
		);
	});

	$: editCollectionId = $fragment.replace('#', '');
	$: editCollection = $collections.find(
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
		return types.map(({ label, slug: value }) => ({ label, value }));
	}
</script>

<style lang="scss">
	@media (max-width: 480px) {
		:global(.spectre .input-group) {
			flex-flow: row wrap;
		}
	}
</style>
