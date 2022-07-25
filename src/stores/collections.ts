import { get } from 'svelte/store';
import { query } from 'svelte-pathfinder';
import { syncable } from 'svelte-asyncable';
import { streamable } from 'svelte-streamable';
import { toast } from 'svelte-spectre';
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
		} else {
			getCollections(get(query).toString())
		}
	}
);

export default syncable<CollectionDTO>(collectionsAsync, { data: [], total: 0, types: [] });
