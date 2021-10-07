export const API_BASEURL =
    __env === 'production'
        ? 'https://gate.basf.science/v0'
        : 'http://localhost:3000';

export const BASE_PATH = __env === 'production' ? '/gui' : '';
