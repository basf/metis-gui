import { get } from 'svelte/store'
import { query } from 'svelte-pathfinder';
import { syncable } from 'svelte-asyncable';
import { streamable } from 'svelte-streamable';
import { toast } from 'svelte-spectre';
import { getDataSources } from '@/services/api';
import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';
import type { DataSource, Stream, CollectionType } from '@/types/dto';

type DataDTO = {
	data: DataSource[],
	total: number,
	type: CollectionType[]
}

export const datasourcesAsync = streamable<Stream<DataDTO>, DataDTO>(
	{
		url: STREAM_URL,
		event: 'datasources',
		withCredentials: true,
	},
	(res) => {
		console.log(res);
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Structures synced' });
			return { ...res };
		} else {
			getDataSources(get(query).toString())
		}
	}
);

export default syncable<DataDTO>(datasourcesAsync, { data: [], total: 0, types: [] });
