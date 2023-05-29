import { writable } from 'svelte/store';
import { manageAPIKey } from '@/services/api';

export default function () {

	const apikey = writable({});
	const loading = writable(false);
	const error = writable(false);

	async function controlAPIKey(action) {
		loading.set(true);
		error.set(false);

		try {
			const result = await manageAPIKey(action);
			apikey.set(result.apikey);

		} catch(e) {
			error.set(e);
		}
		loading.set(false);
	}

	controlAPIKey('get');

	return [apikey, loading, error, controlAPIKey];
}
