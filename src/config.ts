import type { ToastItem } from 'svelte-spectre';

export const RUNTIME_CONFIG = typeof window !== 'undefined' && window._METIS_RUNTIME_CONFIG || {};

export const IS_PROD = __env === 'production';
export const IS_FILE = location.protocol === 'file:';

export const GUI_HOST = RUNTIME_CONFIG.GUI_HOST ||
	(IS_FILE
		? IS_PROD
			? 'https://app.metis.science'
			: 'http://localhost:5000'
		: location.origin);

export const API_VERSION = 'v0';

export const API_HOST = RUNTIME_CONFIG.API_HOST ||
	(IS_PROD ? 'https://beta.metis.science' : 'http://localhost:3000');

export const API_BASEURL = `${API_HOST}/${API_VERSION}`;

export const STREAM_URL = API_HOST + '/stream';

export const BASE_PATH = RUNTIME_CONFIG.BASE_PATH || '';

export const NEW_VERSION_CHECK_DELAY = 60000;

export const VISUALIZER_URL = 'https://tilde-lab.github.io/cifplayer/player.html';
export const OPTIMADE_PROVIDERS_URL = 'https://providers.optimade.org/providers.json';
export const CORS_PROXY_URL = 'https://cors.optimade.science';
export const OPTIMADE_PROVIDERS = RUNTIME_CONFIG.OPTIMADE_PROVIDERS || ['mp', 'mc2d', 'mc3d', 'icdd-pdf-4-plus', 'ccdc']; // FIXME the last two are private
export const SEARCH_DELAY = 1000;

export const DOWNLOADABLE_APP_FILENAME = 'index.html';

export const SYNC_TOASTS_CONFIG = { timeout: 2000, pos: 'bottom_right' } as ToastItem;

export const IdPs = RUNTIME_CONFIG.IDPS || ['basf']; // available: mpds, github, linkedin, orcid, basf, local

export const PAGE_LIMIT = RUNTIME_CONFIG.PAGE_LIMIT || 25;

export const COMMON_POPUPS = {'add_calc': 'Queued for Calculations', 'add_data': 'Adding to My data'};
