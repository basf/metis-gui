import type { ToastItem } from 'svelte-spectre';

export const IS_PROD = __env === 'production';
export const IS_FILE = location.protocol === 'file:';

export const GUI_HOST = IS_FILE
	? IS_PROD
		? 'https://metis.science'
		: 'http://localhost:5000'
	: location.origin;

export const API_VERSION = 'v0';

export const API_HOST = IS_PROD ? 'https://gate.metis.science' : 'http://localhost:3000';

export const API_BASEURL = `${API_HOST}/${API_VERSION}`;

export const STREAM_URL = API_HOST + '/stream';

export const BASE_PATH = '';

export const NEW_VERSION_CHECK_DELAY = 60000;

export const OPTIMADE_PROVIDERS_URL = 'https://providers.optimade.org/providers.json';
export const CORS_PROXY_URL = 'https://cors.optimade.science';
export const OPTIMADE_PROVIDERS = ['mp', 'nmd', 'icdd-pdf-4-plus', 'ccdc']; // FIXME the last two are private
export const SEARCH_DELAY = 1000;

export const DOWNLOADABLE_APP_FILENAME = 'index.html';

export const SYNC_TOASTS_CONFIG = { timeout: 2000, pos: 'bottom_right' } as ToastItem;

export const IdPs = ['basf', 'local']; // available: github, linkedin, orcid, basf, and local

export const PAGE_LIMIT = 25;
