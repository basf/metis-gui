import { asyncable, syncable } from 'svelte-asyncable';
import { streamable } from 'svelte-streamable';

import type { Readable } from 'svelte/store';
import type { Asyncable } from 'svelte-asyncable';
import type { CollectionType as CollectionTypeDTO, Collection as CollectionDTO } from '@/types/dto'

import { getCollectionTypes } from '@/services/api';

import { STREAM_URL } from '@/config';

export const typesAsync: Asyncable<CollectionTypeDTO[]> = asyncable(getCollectionTypes, null);

export const types: Readable<CollectionTypeDTO[]> = syncable(typesAsync, []);

export const collections: Readable<CollectionDTO[]> = streamable<CollectionDTO[]>(
    {
        url: STREAM_URL,
        event: 'collections',
        withCredentials: true,
    },
    undefined,
    []
);