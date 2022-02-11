import { STREAM_URL } from '@/config';
import { streamable } from 'svelte-streamable';
import type { Calculation as CalculationDTO } from '@/types/dto';

export default streamable<CalculationDTO[]>(
    {
        url: STREAM_URL,
        event: 'calculations',
        withCredentials: true,
    },
    undefined,
    []
);
