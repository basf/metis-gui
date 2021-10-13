import { asyncable, syncable } from 'svelte-asyncable';
import { query } from 'svelte-pathfinder';
import debounce from 'debounce-promise';

import type { Readable, Writable } from 'svelte/store';
import type { Types } from 'optimade';
import type { Asyncable } from 'svelte-asyncable';
import type { StringParams } from 'svelte-pathfinder';

import optimade from '@/services/optimade';

import { OPTIMADE_PROVIDERS, SEARCH_DELAY } from '@/config';

type StructuresByProviders = Array<Array<[Types.Structure, Types.Provider]>>;

const getStructuresAll = debounce(
    (providers: string[], filter: string, batch: boolean) => {
        return optimade.getStructuresAll(providers, filter, batch) || [];
    },
    SEARCH_DELAY
);

export const providersAsync: Asyncable<Types.Provider[]> = asyncable(
    async (): Promise<Types.Provider[]> => {
        const providers = optimade.providers || (await optimade.getProviders());
        return providers
            ? Object.values(providers).filter((provider) =>
                  OPTIMADE_PROVIDERS.includes(provider.id)
              )
            : [];
    },
    null
);

export const providers: Readable<Types.Provider[]> = syncable(
    providersAsync,
    []
);

export const structuresAsync = asyncable<
    [Writable<StringParams>],
    StructuresByProviders
>(
    async ($query: StringParams) => {
        if (!$query.params.q || !$query.params.provider) return [];

        await providersAsync.get();

        return getStructuresAll([$query.params.provider], $query.params.q);
    },
    null,
    [query]
);

export const structures: Readable<StructuresByProviders[]> = syncable(
    structuresAsync,
    []
);
