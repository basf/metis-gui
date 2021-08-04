import { streamable } from 'svelte-streamable';

export default streamable<number>({
    url: 'http://localhost:3000/stream',
    event: 'counter'
}, undefined, 0);