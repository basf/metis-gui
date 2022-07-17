import { syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';

import type { DataSource as DataDTO, Stream as StreamDTO } from '@/types/dto';

import { getDataSources } from '@/services/api';

import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';
interface Data {
	data: DataDTO[];
	total: number;
}
export const datasourcesAsync = streamable<StreamDTO<Data>, Data>(
	{
		url: STREAM_URL,
		event: 'datasources',
		withCredentials: true,
	},
	(res) => {
		console.log(res)
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Structures synced' });
			return res.data;
		}
		// else {
		// 	getDataSources()
		// }
	}
);

export default syncable(datasourcesAsync, []);
