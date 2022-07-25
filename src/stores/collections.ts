import { derived, Readable } from 'svelte/store';
import { state, query } from 'svelte-pathfinder';
import { syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';
import { getCollections } from '@/services/api';
import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';
import type { CollectionType, Collection, Stream } from '@/types/dto';

type CollectionDTO = {
	data: Collection[],
	total: number,
	types: CollectionType[]
}

export const collectionsAsync = streamable<Stream<CollectionDTO>, CollectionDTO>(
	{
		url: STREAM_URL,
		event: 'collections',
		withCredentials: true,
	},
	(res) => {
		console.log(res);
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Collections synced' });
			return { ...res };
		}
	}
	// , { data: [], total: 0, types: [] }
);

export default syncable<CollectionDTO>(collectionsAsync);

export const collections: Readable<CollectionDTO> = derived([collectionsAsync, state, query],
	([$collectionsAsync, $state, $query], set) => {
		$collectionsAsync.then(($collections) => {
			if (Object.keys($query.params).length >= 4 && $state.query !== $query.toString()) {
				$state.query = $query.toString()
				getCollections($query.toString());
			} else set($collections);
		});
	});
