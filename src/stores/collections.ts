import { syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';

import type {
	CollectionType as CollectionTypeDTO,
	Collection,
	Stream as StreamDTO,
} from '@/types/dto';

type CollectionDTO = {
	data: Collection[],
	total: number,
	types: CollectionTypeDTO[]
}

import { getCollections } from '@/services/api';

import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';
import { derived, Readable } from 'svelte/store';
import { state, query } from 'svelte-pathfinder';


export const collectionsAsync = streamable<StreamDTO<CollectionDTO>, CollectionDTO>(
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
	}, { data: [], total: 0, types: [] }
);

export default syncable<CollectionDTO>(collectionsAsync, { data: [], total: 0, types: [] });

export const collections: Readable<CollectionDTO> = derived(
	[collectionsAsync, state, query],
	([$collectionsAsync, $state, $query], set) => {
		$collectionsAsync.then(($collections) => {
			if ($state.query !== $query.toString()) {
				$state.query = $query.toString()
				getCollections($query);
			} else set($collections);
		});
	});
