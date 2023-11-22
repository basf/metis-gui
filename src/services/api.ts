import { userAsync } from '@/stores/user'; // FIXME leaking abstraction

import { API_HOST, API_BASEURL } from '@/config';
import type {
	User as UserDTO,
	Engine as EngineDTO,
	Collection as CollectionDTO,
	CollectionType as CollectionTypeDTO,
} from '@/types/dto';

export interface HttpError extends Error {
	response?: Response;
}

export type HttpHeaders = Record<string, string>;
export type QueryParams = Record<string, unknown>;

export async function getFilters(query?: string): Promise<void> {
	return getJSON(`/filters${query || ''}`);
}

export async function getDataSource(id: number): Promise<void> {
	return getJSON(`/datasources/${id}`);
}

export async function getDataSources(query?: string): Promise<void> {
	return getJSON(`/datasources${query || ''}`);
}

export async function setDataSources(content: string | string[], name?: string | string[]): Promise<void> {
	return postJSON('/datasources', { content, name });
}

export async function importDataSource(id: string): Promise<void> {
	return putJSON(`/datasources`, { id });
}

export async function patchDataSourceCollections(
	id: number,
	collectionIds: number[]
): Promise<unknown> {
	return patchJSON(`/datasources/${id}/filters`, collectionIds);
}

export async function delDataSource({ id, query }: { id: number; query?: string }): Promise<void> {
	return delJSON(`/datasources/${id}${query || ''}`);
}

export async function getCalculations(query?: string): Promise<void> {
	return getJSON(`/calculations${query || ''}`);
}

export async function getCalculationEngines(): Promise<void> {
	return fetchJSON(`${API_HOST}/calculations/supported`, { credentials: 'omit' });
}

export async function getCalculationEngine(id: number, engine: string = 'dummy'): Promise<EngineDTO> {
	return getJSON(`/calculations/template?id=${id}&engine=${engine}`);
}

export async function setCalculation({
	dataId,
	engine = 'dummy',
	input,
	workflow = 'workflow',
	query = '',
}: {
	dataId: number;
	engine?: string;
	input?: string;
	workflow?: string;
	query?: string;
}): Promise<void> {
	postJSON(`/webhooks/calc_update${query}`, {}); // FIXME

	return postJSON(`/calculations${query}`, { dataId, engine, input, workflow });
}

export async function delCalculation({ id, query }: { id: number; query?: string }): Promise<void> {
	return delJSON(`/calculations/${id}${query || ''}`);
}

export async function setPI(id: number, els: string, strict: boolean): Promise<void> {
	return postJSON(`/calculations/phaseid`, {id, els, strict: strict ? 1 : 0});
}

export async function login(email: string, password: string): Promise<void> {
	return postJSON('/auth', { email, password });
}

export async function logout(): Promise<void> {
	return delJSON('/auth');
}

export async function me(): Promise<UserDTO> {
	return getJSON<UserDTO>('/auth');
}

export async function setMe(data: UserDTO): Promise<UserDTO> {
	return putJSON<UserDTO, UserDTO>('/auth', data);
}

export async function getCollectionTypes(): Promise<CollectionTypeDTO[]> {
	return getJSON('/collections/types');
}

export async function getCollectionDataSources(): Promise<void> {
	return getJSON(`/collections/datasources`);
}

export async function getCollections(query?: string): Promise<void> {
	return getJSON(`/collections${query || ''}`);
}

export async function setCollection(collection: CollectionDTO): Promise<void> {
	return putJSON('/collections', collection);
}

export async function delCollection(collectionId: number): Promise<void> {
	return delJSON(`/collections/${collectionId}`);
}

export async function searchUsers(search: string, limit = 10): Promise<UserDTO[]> {
	if (!search) return [];
	return getJSON('/users', { search, limit });
}

export async function getUsers(ids: number[] = []): Promise<UserDTO[]> {
	if (!ids.length) return [];
	return getJSON('/users', { ids: ids.join(',') });
}

export async function manageAPIKey(action: 'get' | 'set' | 'remove'): Promise<void> {
	if (action === 'get')
		return getJSON('/apikey');

	else if (action === 'set')
		return putJSON('/apikey');

	else
		return delJSON('/apikey');
}

export async function getJSON<T>(
	path: string,
	params?: QueryParams,
	headers?: HttpHeaders
): Promise<T> {
	const url = new URL(API_BASEURL + path);

	if (params) {
		Object.entries(params).forEach(([key, value]) =>
			url.searchParams.append(key, value as string)
		);
	}

	return fetchJSON(url.toString(), { headers });
}

export async function postJSON<T, U>(path: string, data: T, headers?: HttpHeaders): Promise<U> {
	const url = new URL(API_BASEURL + path);

	return fetchJSON<U>(url.toString(), {
		method: 'POST',
		body: JSON.stringify(data),
		headers,
	});
}

export async function putJSON<T, U>(path: string, data: T, headers?: HttpHeaders): Promise<U> {
	const url = new URL(API_BASEURL + path);

	return fetchJSON<U>(url.toString(), {
		method: 'PUT',
		body: JSON.stringify(data),
		headers,
	});
}

export async function patchJSON<T, U>(path: string, data: T, headers?: HttpHeaders): Promise<U> {
	const url = new URL(API_BASEURL + path);

	return fetchJSON<U>(url.toString(), {
		method: 'PATCH',
		body: JSON.stringify(data),
		headers,
	});
}

export async function delJSON<T, U>(path: string, headers?: HttpHeaders): Promise<U> {
	const url = new URL(API_BASEURL + path);

	return fetchJSON<U>(url.toString(), {
		method: 'DELETE',
		headers,
	});
}

// low-level transport
export default async function fetchJSON<T>(
	url: string,
	{ headers, ...options }: RequestInit = {}
): Promise<T> {
	const req = new Request(url, {
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		credentials: 'include',
		mode: 'cors',
		...options,
	});

	const res = await fetch(req);

	if (!res.ok) {
		if (res.status === 401) {
			userAsync.set(null); // FIXME leaking abstraction
			return null;
		}
		const json = await res.json();
		const err: HttpError = new Error(json.error);
		err.response = res;
		throw err;
	}

	if (res.status === 204) {
		return null;
	}

	return await res.json();
}
