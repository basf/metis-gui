import { syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';

import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';
import type { CollectionType, Collection, Stream } from '@/types/dto';

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
	},
	{ data: [], total: 0, types: [] }
);

export default syncable<CollectionDTO>(filtersAsync, { data: [], total: 0, types: [] });
