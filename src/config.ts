import type { ToastItem } from 'svelte-spectre';
import env from './env';

const IS_PROD = env.NODE_ENV === 'production';
const IS_FILE = location.protocol === 'file:';

const GUI_HOST =
	env.GUI_HOST ||
	(IS_FILE ? (IS_PROD ? 'https://metis.science' : 'http://localhost:5000') : location.origin);

const API_VERSION = 'v0';

const API_BASEURL = `${env.API_HOST}/${API_VERSION}`;

const STREAM_URL = env.API_HOST + '/stream';

const DOWNLOADABLE_APP_FILENAME = 'index.html';

const SYNC_TOASTS_CONFIG = { timeout: 2000, pos: 'bottom_right' } as ToastItem;

const config = {
	...env,
	IS_PROD,
	IS_FILE,
	GUI_HOST,
	API_VERSION,
	API_BASEURL,
	STREAM_URL,
	DOWNLOADABLE_APP_FILENAME,
	SYNC_TOASTS_CONFIG,
};
export default config;
