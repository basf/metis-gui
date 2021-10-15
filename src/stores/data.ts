import { writable } from 'svelte/store';
import { streamable } from 'svelte-streamable';

import { STREAM_URL } from '@/config';
import type { Data as DataDTO } from '@/types/dto';

export const content = writable('');

export default streamable<DataDTO[]>(
    {
        url: STREAM_URL,
        event: 'data',
    },
    undefined,
    []
);
