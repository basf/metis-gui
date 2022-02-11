import { streamable } from 'svelte-streamable';

import { STREAM_URL } from '@/config';
import type { DataSource as DataDTO } from '@/types/dto';

export default streamable<DataDTO[]>(
    {
        url: STREAM_URL,
        event: 'datasources',
        withCredentials: true,
    },
    undefined,
    []
);
