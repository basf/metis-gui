import { API_BASEURL } from '@/config';
import { streamable } from 'svelte-streamable';
import type { Calculation as CalculationDTO } from '@/types/dto';

export default streamable<CalculationDTO[]>(
    {
        url: API_BASEURL + '/stream',
        event: 'calculations',
    },
    undefined,
    []
);
