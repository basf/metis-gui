import { writable } from 'svelte/store';
import { me } from '@/services/api';

import type { User as UserDTO } from '@/types/dto';

const user = writable<UserDTO | null>(null, (set) => {
    me().then(set);
});

export default user;
