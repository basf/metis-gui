<Main>
	<Filter tooltip="Add collection" action={() => openEdit()} />

	<div bind:clientWidth={width} class="py-2">
		<Grid stack>
			{#await $collectionsAsync}
				{#each { length: 9 } as _}
					<Col col="auto">
						<Loaders.Tile
							count={1}
							w={width / 3 - 12}
							h={107}
							height={107}
							width={width / 3 - 12}
						/>
					</Col>
				{/each}
			{:then { data, total }}
				<Col col="12">
					<Pagination
						bind:limit={$query.params.limit}
						bind:page={$query.params.page}
						limits={[5, 10, 50, 100]}
						{total}
						rest={7}
					/>
				</Col>
				{#each data as collection (collection.id)}
					<Col col="4" md="6" xs="12">
						<Collection {...collection} on:edit={(e) => openEdit(e.detail.id)} />
					</Col>
				{/each}
			{/await}
		</Grid>
	</div>
</Main>

{#if $fragment}
	<CollectionEditModal
		{...editCollection}
		open={!!$fragment}
		size={$media.sm ? 'fs' : 'lg'}
		on:save={saveCollection}
		on:remove={removeCollection}
		on:close={closeEdit}
	/>
{/if}

<script lang="ts" context="module">
	import { query, fragment } from 'svelte-pathfinder';
	import { media } from '@/stores/media';

	import { Col, Grid, toast, Pagination } from 'svelte-spectre';

	import { Collection } from '@/views/tiles/';
	import { Filter } from '@/components/Filter';

	import user from '@/stores/user';
	import collections, { collectionsAsync } from '@/stores/collections';

	import { setCollection, delCollection, getCollections } from '@/services/api';
	import type { HttpError } from '@/services/api';

	import * as Loaders from '@/components/loaders';
	import Main from '@/layouts/Main.svelte';

	import CollectionEditModal from '@/views/modals/CollectionEdit.svelte';
</script>

<script lang="ts">
	let width: number;
	let queryString = $query.toString();

	$: if (queryString !== $query.toString()) {
		queryString = $query.toString();
		getCollections(queryString);
	}

	$: editCollectionId = $fragment.replace('#', '');
	$: editCollection = $collections.data.find(
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
</script>

<style lang="scss">
	@media (max-width: 480px) {
		:global(.spectre .input-group) {
			flex-flow: row wrap;
		}
	}
</style>
