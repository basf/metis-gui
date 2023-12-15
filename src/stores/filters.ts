import { query } from 'svelte-pathfinder';
import { asyncable, syncable } from 'svelte-asyncable';
import { streamable } from 'svelte-streamable';
import { toast } from 'svelte-spectre';

import { getFilters } from '@/services/api';
import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';

import { type Unsubscriber } from 'svelte/store';
import type { CollectionType, Collection, Stream } from '@/types/dto';
import datasources from './datasources';

export type CollectionDTO = {
	data: Collection[],
	total: number,
	types: CollectionType[]
}

let unsubscribe: Unsubscriber;

export const filtersAsyncReq = asyncable(getFilters);
export const filtersAsync = streamable<Stream<CollectionDTO>, CollectionDTO>(
	{
		url: STREAM_URL,
		event: 'filters',
		withCredentials: true,
	},
	(res, set) => {
		//console.log(res);
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Filters synced' });
			set({ ...res });

		} else {
			unsubscribe = filtersAsyncReq.subscribe(async ($filtersAsyncReq) => {
				//const { reqId } = await $filtersAsyncReq
				//toast.primary({ ...SYNC_TOASTS_CONFIG, msg: `Collections requested: ${reqId}` });
			})
		}
		return (lastSubscriber) => {
			lastSubscriber && unsubscribe();
		}
	}
);

export const filters = syncable<CollectionDTO>(filtersAsync, { data: [], total: 10, types: [] });
