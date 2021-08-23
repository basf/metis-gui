import { streamable } from 'svelte-streamable';
import type { Data as DataDTO } from '@/types/dto'; 

export default streamable<DataDTO[]>({
    url: 'http://localhost:3000/stream',
    event: 'data'
}, undefined, []);