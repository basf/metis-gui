import { writable } from 'svelte/store';
import { streamable } from 'svelte-streamable';

import { API_BASEURL } from '@/config';
import type { Data as DataDTO } from '@/types/dto';

export const content = writable('');

export default streamable<DataDTO[]>(
    {
        url: API_BASEURL + '/stream',
        event: 'data',
    },
    undefined,
    []
);
