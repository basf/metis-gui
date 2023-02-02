import type { ToastItem } from 'svelte-spectre';

import { getEnv } from './env';

const env = getEnv(globalThis._METIS_RUNTIME_CONFIG);

export const IS_PROD = env.NODE_ENV === 'production';
export const IS_FILE = location.protocol === 'file:';

export const GUI_HOST =
	env.GUI_HOST ||
	(IS_FILE ? (IS_PROD ? 'https://metis.science' : 'http://localhost:5000') : location.origin);

export const API_VERSION = 'v0';

export const API_BASEURL = `${env.API_HOST}/${API_VERSION}`;

export const STREAM_URL = env.API_HOST + '/stream';

export const DOWNLOADABLE_APP_FILENAME = 'index.html';

export const SYNC_TOASTS_CONFIG = { timeout: 2000, pos: 'bottom_right' } as ToastItem;

export const {
	NODE_ENV,
	API_HOST,
	BASE_PATH,
	NEW_VERSION_CHECK_DELAY,
	VISUALIZER_URL,
	OPTIMADE_PROVIDERS,
	OPTIMADE_PROVIDERS_URL,
	CORS_PROXY_URL,
	SEARCH_DELAY,
	IdPs,
	PAGE_LIMIT,
} = env;
