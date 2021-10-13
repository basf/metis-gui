import { Optimade } from 'optimade';

import prefetched from 'optimade/dist/prefetched.json';

import {
    OPTIMADE_PROVIDERS_URL as providersUrl,
    CORS_PROXY_URL as corsProxyUrl,
} from '@/config';

const optimade = new Optimade({ providersUrl, corsProxyUrl });

prefetched.providers &&
    Object.keys(prefetched.providers).forEach((key) => {
        prefetched.providers[key].attributes.api_version =
            prefetched.apis[key][0].attributes.api_version;
    });

optimade.providers = prefetched.providers;
optimade.apis = prefetched.apis;

export default optimade;

export type { Types } from 'optimade';
