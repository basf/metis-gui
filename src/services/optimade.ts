import { Optimade } from 'optimade';
import nlp from '@/packages/optimade-nlp';

import prefetched from 'optimade/dist/prefetched.json';

import {
    OPTIMADE_PROVIDERS_URL as providersUrl,
    CORS_PROXY_URL as corsProxyUrl,
} from '@/config';

export type { Types } from 'optimade';

const guesser = nlp();

export function guess(search) {
    if (search) {
        const result = guesser.guess(search);
        return guesser.to_optimade(result);
    }
}

const optimade = new Optimade({ providersUrl, corsProxyUrl });

prefetched.providers &&
    Object.keys(prefetched.providers).forEach((key) => {
        prefetched.providers[key].attributes.api_version =
            prefetched.apis[key][0].attributes.api_version;
    });

optimade.providers = prefetched.providers;
optimade.apis = prefetched.apis;

export default optimade;