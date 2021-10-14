
export const API_BASEURL =
    __env === 'production'
        ? 'https://gate.basf.science/v0'
        : 'http://localhost:3000';

export const BASE_PATH = __env === 'production' ? '/gui' : '';

export const SEARCH_DELAY = 1000;

export const OPTIMADE_PROVIDERS_URL =
    'https://providers.optimade.org/providers.json';

export const CORS_PROXY_URL = 'https://cors.optimade.science';

export const OPTIMADE_PROVIDERS = ['mp', 'cod', 'nmd', 'mpds'];