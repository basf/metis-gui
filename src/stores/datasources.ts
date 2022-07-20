import { derived, get } from 'svelte/store'
import { syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';
import { query, StringParams } from 'svelte-pathfinder';


import type { DataSource as Data, Stream as StreamDTO } from '@/types/dto';

import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';
import { getDataSources } from '@/services/api';

interface DataDTO {
	data: Data[];
	total: number;
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
			return res.data;
		}
	}, { data: [], total: 0 }
);

export default syncable<DataDTO>(datasourcesAsync, { data: [], total: 0 });

// export const datasources = derived([data, query],
// 	([$data, $query], set) => {
// 		const { data, total } = $data;
// 		console.log($data, $query.params)
// 		if (data.length) set($data || [])
// 		else getDataSources($query)
// 	}, { data: [], total: 0 });

export const datasources = derived([
	datasourcesAsync,
	query
], ([$datasourcesAsync, $query], set) => {
	$datasourcesAsync.then(($datasources) => {
		console.log($datasources, $query)
		// $datasources = undefined
		if (!$datasources.data.length) {
			getDataSources($query);
		}
		set($datasources || { data: [], total: 0 });
	});
}, { data: [], total: 0 });
