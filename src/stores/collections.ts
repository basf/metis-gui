import { query } from 'svelte-pathfinder';
import { asyncable, syncable } from 'svelte-asyncable';
import { streamable } from 'svelte-streamable';
import { toast } from 'svelte-spectre';

import { getCollections } from '@/services/api';
import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';

import type { CollectionType, Collection, Stream } from '@/types/dto';
import { type Unsubscriber } from 'svelte/store'

type CollectionDTO = {
	reqId: string,
	data: Collection[],
	total: number,
	types: CollectionType[]
}

let unsubscribe: Unsubscriber

export const collectionsAsyncReq = asyncable(($query) => getCollections($query), null, [query])

export const collectionsAsync = streamable<Stream<CollectionDTO>, CollectionDTO>(
	{
		url: STREAM_URL,
		event: 'collections',
		withCredentials: true,
	},
	(res, set) => {
		console.log(res);
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Collections synced' });
			set({ ...res });
		} else {
			unsubscribe = collectionsAsyncReq.subscribe(async ($collectionsAsyncReq) => {
				// const { reqId } = await $collectionsAsyncReq
				// toast.primary({ ...SYNC_TOASTS_CONFIG, msg: `Collections requested: ${reqId}` });
			})
		}
		return (lastSubscriber) => {
			lastSubscriber && unsubscribe()
		}
	}
);

export default syncable<CollectionDTO>(collectionsAsync, { data: [], total: 10, types: [] });
