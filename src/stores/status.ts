import { readable } from 'svelte/store';
import { statusable } from 'svelte-statusable';

import { API_BASEURL, STREAM_URL, NEW_VERSION_CHECK_DELAY } from '@/config';

const manifest = document.querySelector('[rel="manifest"]');

export const updates = readable(false, (set) => {
	let interval;

	if (manifest) {
		const url = manifest.getAttribute('href');

		if (url) {
			interval = setInterval(() => {
				fetch(url)
					.then((res) => res.json())
					.then(({ version }) => {
						set(version !== __ver);
					});
			}, NEW_VERSION_CHECK_DELAY);
		}
	}

	return () => clearInterval(interval);
});

export default statusable({
	ping: API_BASEURL,
	// sse: STREAM_URL,
});
