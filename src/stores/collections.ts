import { asyncable, syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';

import type {
	CollectionType as CollectionTypeDTO,
	Collection,
	Stream as StreamDTO,
} from '@/types/dto';

type CollectionDTO = {
	data: Collection[],
	total: number
}

import { getCollectionTypes } from '@/services/api';

import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';

export const typesAsync = asyncable<CollectionTypeDTO[]>(getCollectionTypes, null);

export const types = syncable<CollectionTypeDTO[]>(typesAsync, []);

export const collectionsAsync = streamable<StreamDTO<CollectionDTO>, CollectionDTO>(
	{
		url: STREAM_URL,
		event: 'collections',
		withCredentials: true,
	},
	(res) => {
		console.log(res);
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Collections synced' });
			return res.data;
		}
	}
);

export default syncable<CollectionDTO>(collectionsAsync, { data: [], total: 0 });
