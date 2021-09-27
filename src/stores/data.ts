import { API_BASEURL } from '@/config';
import { streamable } from 'svelte-streamable';
import type { Data as DataDTO } from '@/types/dto';

export default streamable<DataDTO[]>(
    {
        url: API_BASEURL + '/stream',
        event: 'data',
    },
    undefined,
    []
);
