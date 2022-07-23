import { derived } from 'svelte/store'
import { syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';
import { state, query } from 'svelte-pathfinder';

import type { DataSource as Data, Stream as StreamDTO, CollectionType as CollectionTypeDTO } from '@/types/dto';

import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';
import { getDataSources } from '@/services/api';

interface DataDTO {
	data: Data[];
	total: number;
	type: CollectionTypeDTO[]
}
export const datasourcesAsync = streamable<StreamDTO<DataDTO>, DataDTO>(
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

export const datasources = derived(
	[datasourcesAsync, state, query],
	([$datasourcesAsync, $state, $query], set) => {
		$datasourcesAsync.then(($datasources) => {
			if ($state.query !== $query.toString()) {
				$state.query = $query.toString()
				getDataSources($query);
			} else set($datasources)
		});
	});
