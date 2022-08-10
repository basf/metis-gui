<Main>
	<Section
		asyncData={$collectionsAsync}
		addTooltip="Add collection"
		addAction={() => openEdit()}
		bind:width
	>
		<svelte:fragment slot="loader">
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
		</svelte:fragment>
		<svelte:fragment let:item>
			<Col col="4" md="6" xs="12">
				<Collection {...item} on:edit={(e) => openEdit(e.detail.id)} />
			</Col>
		</svelte:fragment>
	</Section>
</Main>

{#if $fragment}
	<CollectionEdit
		{...editCollection}
		open={!!$fragment}
		size={$media.sm ? 'fs' : 'lg'}
		on:save={saveCollection}
		on:remove={removeCollection}
		on:close={closeEdit}
	/>
{/if}

<script lang="ts" context="module">
	import { fragment } from 'svelte-pathfinder';
	import { Col, toast } from 'svelte-spectre';

	import { Collection } from '@/views/tiles/';
	import * as Loaders from '@/components/loaders';
	import { Main, Section } from '@/layouts';
	import { CollectionEdit } from '@/views/modals';

	import user from '@/stores/user';
	import { media } from '@/stores/media';
	import collections, { collectionsAsync } from '@/stores/collections';

	import { setCollection, delCollection } from '@/services/api';
	import type { HttpError } from '@/services/api';
</script>

<script lang="ts">
	let width: number;

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
