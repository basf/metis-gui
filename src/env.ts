import { z, Schemas, inferSchemas, parseEnv } from 'znv';

export const schema = {
	NODE_ENV: z.enum(['production', 'development', 'test']),
	LIGHT_MODE: z.boolean().default(false),
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

	IdPs: {
		schema: z.string().array(), // available: mpds, github, linkedin, orcid, basf, local
		defaults: {
			production: ['basf'],
			_: ['local'],
		},
	},

	PAGE_LIMIT: z.number().int().default(25),
};
export type Schema = typeof schema;

const toOptionalEntries = (s: Schemas) =>
	Object.entries(s).map(([k, v]) => [
		k,
		'schema' in v ? { ...v, schema: v.schema.optional() } : v.optional(),
	]);

export const toOptionalSchema = <T extends Schemas>(s: T): T =>
	inferSchemas(Object.fromEntries(toOptionalEntries(s)));

export const mergeParsedSchemas = <T extends Record<string, unknown>>(...schemas: T[]): T => {
	return Object.assign(
		{},
		...schemas.map((s) =>
			Object.fromEntries(Object.entries(s).filter(([_k, v]) => v !== undefined))
		)
	);
};

type ParseEnv<T extends Schemas> = typeof parseEnv<T>;
let parsedProcessEnv: ReturnType<ParseEnv<Schema>> | undefined; // cache for parsed process.env
export const getEnv = (
	runtimeEnv?: Parameters<ParseEnv<Schema>>[0]
): ReturnType<ParseEnv<Schema>> =>
	runtimeEnv
		? mergeParsedSchemas(getEnv(), parseEnv(runtimeEnv, toOptionalSchema(schema)))
		: (parsedProcessEnv ??= parseEnv(process.env, schema));
