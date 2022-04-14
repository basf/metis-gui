import { syncable } from 'svelte-asyncable';
import { toast } from 'svelte-spectre';
import { streamable } from 'svelte-streamable';

import type { Calculation as CalculationDTO, Stream as StreamDTO } from '@/types/dto';

import { getCalculations } from '@/services/api';

import { STREAM_URL, SYNC_TOASTS_CONFIG } from '@/config';

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
			getCalculations();
		}
	}
);

export default syncable(calculationsAsync, []);
