import { streamable } from 'svelte-streamable';
import { syncable } from 'svelte-asyncable';

import { STREAM_URL } from '@/config';
import type { Error as ErrorDTO, Stream as StreamDTO } from '@/types/dto';

export const errorsAsync = streamable<StreamDTO<ErrorDTO[]>, ErrorDTO[]>(
	{
		url: STREAM_URL,
		event: 'errors',
		withCredentials: true,
	},
	(res) => res?.data,
	[]
);

export default syncable(errorsAsync, []);
