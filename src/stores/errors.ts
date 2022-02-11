import { streamable } from 'svelte-streamable';

import { STREAM_URL } from '@/config';
import type { Error as ErrorDTO } from '@/types/dto';

export default streamable<ErrorDTO[]>(
    {
        url: STREAM_URL,
        event: 'errors',
        withCredentials: true,
    },
    undefined,
    []
);
