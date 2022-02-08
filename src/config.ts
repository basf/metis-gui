export const API_VERSION = 'v0';

export const API_HOST =
    __env === 'production'
        ? 'https://gate.basf.science'
        : 'http://localhost:3000';
export const API_BASEURL = `${API_HOST}/${API_VERSION}`;

export const STREAM_URL = API_HOST + '/stream';

export const BASE_PATH = '';

export const SEARCH_DELAY = 1000;

export const OPTIMADE_PROVIDERS_URL =
    'https://providers.optimade.org/providers.json';

export const CORS_PROXY_URL = 'https://cors.optimade.science';

export const OPTIMADE_PROVIDERS = [
    'mp',
    'nmd',
    'threedd',
    'icdd-pdf-4-plus',
    'ccdc',
];
