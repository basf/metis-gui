import { syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';
import { query } from 'svelte-pathfinder';
import * as storage from '@/helpers/storage';

import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';
import type { CollectionType, Collection, Stream } from '@/types/dto';
import { get } from 'svelte/store';

type CollectionDTO = {
	data: Collection[],
	total: number,
	types: CollectionType[]
}

export const filtersAsync = streamable<Stream<CollectionDTO>, CollectionDTO>(
	{
		url: STREAM_URL,
		event: 'filters',
		withCredentials: true,
	},
	(res) => {
		console.log(res);
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Filters synced' });
			return { ...res };
		}
	}
);

export const filters = syncable<CollectionDTO>(filtersAsync, { data: [], total: 0, types: [] });

storage.setItem<string>('filters_query', get(query).toString(), sessionStorage);
storage.setItem<CollectionDTO>('filters_data', get(filters), sessionStorage);
