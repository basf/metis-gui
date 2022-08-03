import { query } from 'svelte-pathfinder';
import { asyncable, syncable } from 'svelte-asyncable';
import { streamable } from 'svelte-streamable';
import { toast } from 'svelte-spectre';

import { getDataSources } from '@/services/api';
import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';

import { type Unsubscriber } from 'svelte/store'
import type { DataSource, Stream, CollectionType } from '@/types/dto';

type DataDTO = {
	reqId: string,
	data: DataSource[],
	total: number,
	type: CollectionType[]
}

let unsubscribe: Unsubscriber

export const datasourcesAsyncReq = asyncable(($query) => getDataSources($query), null, [query])

export const datasourcesAsync = streamable<Stream<DataDTO>, DataDTO>(
	{
		url: STREAM_URL,
		event: 'datasources',
		withCredentials: true,
	},
	(res, set) => {
		console.log(res);
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Structures synced' });
			set({ ...res });
		} else {
			unsubscribe = datasourcesAsyncReq.subscribe(async ($datasourcesAsyncReq) => {
				// const { reqId } = await $datasourcesAsyncReq
				// toast.primary({ ...SYNC_TOASTS_CONFIG, msg: `Structures requested: ${reqId}` });
			})
		}
		return (lastSubscriber) => {
			if (lastSubscriber) unsubscribe()
		}
	}
);

export default syncable<DataDTO>(datasourcesAsync, { data: [], total: 10, types: [] });
