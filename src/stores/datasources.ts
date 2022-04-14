import { syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';

import type { DataSource as DataDTO, Stream as StreamDTO } from '@/types/dto';

import { getData } from '@/services/api';

import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';

export const datasourcesAsync = streamable<StreamDTO<DataDTO[]>, DataDTO[]>(
	{
		url: STREAM_URL,
		event: 'datasources',
		withCredentials: true,
	},
	(res) => {
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Structures synced' });
			return res.data;
		} else {
			getData();
		}
	}
);

export default syncable(datasourcesAsync, []);
