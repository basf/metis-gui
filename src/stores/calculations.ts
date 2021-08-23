import { streamable } from 'svelte-streamable';
import type { Calculation as CalculationDTO } from '@/types/dto'; 

export default streamable<CalculationDTO[]>({
    url: 'http://localhost:3000/stream',
    event: 'calculations'
}, undefined, []);