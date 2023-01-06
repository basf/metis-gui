import { parseEnv, z } from 'znv';

const env = parseEnv(process.env, {
	NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
	GUI_HOST: {
		schema: z.string().url(),
		defaults: {
			production: 'https://metis.science',
			_: 'http://localhost:5000',
		},
	},
	API_HOST: {
		schema: z.string().url(),
		defaults: {
			production: 'https://gate.metis.science',
			_: 'http://localhost:3000',
		},
	},
	BASE_PATH: z.string().default(''),
	NEW_VERSION_CHECK_DELAY: z.number().int().default(60000),
	VISUALIZER_URL: z.string().url().default('https://tilde-lab.github.io/cifplayer/player.html'),
	OPTIMADE_PROVIDERS_URL: z
		.string()
		.url()
		.default('https://providers.optimade.org/providers.json'),
	CORS_PROXY_URL: z.string().url().default('https://cors.optimade.science'),
	OPTIMADE_PROVIDERS: z
		.string()
		.array()
		.default(['mp', 'mc2d', 'mc3d', 'icdd-pdf-4-plus', 'ccdc']), // FIXME the last two are private
	SEARCH_DELAY: z.number().int().default(1000),

	IdPs: z.string().array().default(['basf']), // available: mpds, github, linkedin, orcid, basf, local

	PAGE_LIMIT: z.number().int().default(25),
});

export default env;
