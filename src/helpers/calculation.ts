import { get } from 'svelte/store';
import { toast } from 'svelte-spectre';

import { fragment, query } from 'svelte-pathfinder';
import { engines } from '@/stores/calculations';
import { setCalculation } from '@/services/api';

export async function runCalculation(id: number): Promise<boolean> {
	return new Promise((resolve) => {
		const unsubscribe = engines.subscribe(async (item) => {
			if (!item) {
				return;
			}

			// console.log(unsubscribe);
			unsubscribe();

			if (item.length > 1) {
				fragment.set(`#edit-engine-${id}`);
				resolve(false);
			} else {
				await setCalculation({
					dataId: id,
					engine: item[0],
					workflow: 'unused',
					query: get(query).toString(),
				});

				toast.success({
					msg: 'Adding to Calculations',
					timeout: 2000,
					pos: 'top_right',
					icon: 'check',
				});

				resolve(true);
			}
		});
	});
}
