import { query } from 'svelte-pathfinder';
import { asyncable, syncable } from 'svelte-asyncable';
import { streamable } from 'svelte-streamable';
import { toast } from 'svelte-spectre';

import { getCalculations, getCalculationEngines } from '@/services/api';
import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';

import type { Unsubscriber } from 'svelte/store';
import type { Calculation, CollectionType, Stream } from '@/types/dto';

type CalculationDTO = {
	reqId: string,
	data: Calculation[],
	total: number,
	types: CollectionType[]
}

let unsubscribe: Unsubscriber

export const enginesAsync = asyncable<Promise<string[]>>(getCalculationEngines)
export const engines = syncable<string[]>(enginesAsync)

export const calculationsAsyncReq = asyncable(($query) => getCalculations($query), null, [query])
export const calculationsAsync = streamable<Stream<CalculationDTO>, CalculationDTO>(
	{
		url: STREAM_URL,
		event: 'calculations',
		withCredentials: true,
	},
	(res, set) => {
		console.log(res);
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Calculations synced' });
			set({ ...res });
		} else {
			unsubscribe = calculationsAsyncReq.subscribe(async ($calculationsAsyncReq) => {
				// const { reqId } = await $calculationsAsyncReq
				// toast.primary({ ...SYNC_TOASTS_CONFIG, msg: `Calculations requested: ${reqId}` });
			})
		}
		return (lastSubscriber) => {
			if (lastSubscriber) unsubscribe()
		}
	}
);

export default syncable<CalculationDTO>(calculationsAsync, { data: [], total: 10, types: [] });
