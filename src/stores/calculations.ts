import { get } from 'svelte/store';
import { query } from 'svelte-pathfinder';
import { asyncable, syncable } from 'svelte-asyncable';
import { streamable } from 'svelte-streamable';
import { toast } from 'svelte-spectre';

import { getCalculations, getCalculationsEngines } from '@/services/api';
import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';

import type { Calculation as CalculationDTO, Stream as StreamDTO } from '@/types/dto';

export const enginesAsync = asyncable(getCalculationsEngines)
export const engines = syncable(enginesAsync)

export const calculationsAsync = streamable<StreamDTO<CalculationDTO[]>, CalculationDTO[]>(
	{
		url: STREAM_URL,
		event: 'calculations',
		withCredentials: true,
	},
	(res) => {
		if (res) {
			toast.primary({ ...SYNC_TOASTS_CONFIG, msg: 'Calculations synced' });
			return res.data;
		} else {
			getCalculations(get(query).toString());
		}
	}
);

export default syncable(calculationsAsync, []);
