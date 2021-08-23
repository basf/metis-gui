import { writable } from 'svelte/store';
import { me } from '@/services/api';

const user = writable(null, set => {
    me().then(set);
});

export default user;
