import { asyncable, syncable } from 'svelte-asyncable';
import { me, setMe } from '@/services/api';

import type { User as UserDTO } from '@/types/dto';

export const userAsync = asyncable(me, ($user) => {
    if ($user) {
        setMe({
            id: $user.id, 
            email: $user.email,
            firstName: $user.firstName,
            lastName: $user.lastName,
        });
    }
});

const user = syncable<UserDTO | null>(userAsync, null);

export default user;
