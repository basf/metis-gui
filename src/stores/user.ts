import { asyncable, syncable } from 'svelte-asyncable';
import { me } from '@/services/api';

import type { User as UserDTO } from '@/types/dto';

export const userAsync = asyncable(me);

const user = syncable<UserDTO | null>(userAsync, null);

export default user;
