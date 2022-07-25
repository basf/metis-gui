import { derived } from 'svelte/store'
import { syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';
import { state, query } from 'svelte-pathfinder';
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
		}
	}, { data: [], total: 0, types: [] }
);

export default syncable<DataDTO>(datasourcesAsync, { data: [], total: 0, types: [] });

export const datasources = derived([datasourcesAsync, state, query],
	([$datasourcesAsync, $state, $query], set) => {
		$datasourcesAsync.then(($datasources) => {
			if (Object.keys($query.params).length >= 4 && $state.query !== $query.toString()) {
				getDataSources($query.toString());
				$state.query = $query.toString()
			} else set($datasources)
		});
	});
