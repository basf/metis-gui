import { asyncable, syncable } from 'svelte-asyncable';
import { query } from 'svelte-pathfinder';
import debounce from 'debounce-promise';

import type { Readable, Writable } from 'svelte/store';
import type { Types } from 'optimade';
import type { Asyncable } from 'svelte-asyncable';
import type { StringParams } from 'svelte-pathfinder';

import optimade, { guess } from '@/services/optimade';

import * as storage from '@/helpers/storage';

import { OPTIMADE_PROVIDERS, SEARCH_DELAY } from '@/config';

type StructuresByProviders = Array<[Types.StructuresResponse[], Types.Provider]>;

const getStructuresAll = debounce(
	(providers: string[], filter: string, page: number, limit: number, offset: number, batch: boolean) => {
		return optimade.getStructuresAll({ providers, filter, page, limit, offset, batch }) || [];
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

export const providers: Readable<Types.Provider[]> = syncable(providersAsync, []);

export const structuresAsync = asyncable<[Writable<StringParams>], StructuresByProviders>(
	async ($query: StringParams) => {
		if (!$query.params.q || !$query.params.provider) return [];

		const queryString = storage.getItem<string>('optimade_query', sessionStorage);
		const cachedStructures = storage.getItem<StructuresByProviders>(
			'optimade_structures',
			sessionStorage
		);

		if (cachedStructures && queryString === $query.toString()) {
			return cachedStructures;
		}

		await providersAsync.get();

		const structures = await getStructuresAll(
			[$query.params.provider],
			guess($query.params.q) || $query.params.q,
			$query.params.page,
			$query.params.limit
		);

		storage.setItem<string>('optimade_query', $query.toString(), sessionStorage);
		storage.setItem<StructuresByProviders>('optimade_structures', structures, sessionStorage);

		return structures;
	},
	null,
	[query]
);

export const structures: Readable<StructuresByProviders[]> = syncable(structuresAsync, []);
