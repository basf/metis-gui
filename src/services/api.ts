import { userAsync } from '@/stores/user';

import { API_HOST, API_BASEURL } from '@/config';
import type {
	User as UserDTO,
	Template as TemplateDTO,
	Collection as CollectionDTO,
	CollectionType as CollectionTypeDTO,
} from '@/types/dto';

export interface HttpError extends Error {
	response?: Response;
}

export type HttpHeaders = Record<string, string>;
export type QueryParams = Record<string, unknown>;

export async function getData(): Promise<void> {
	return getJSON('/data');
}

export async function setData(content: string | string[]): Promise<void> {
	return postJSON('/data', { content });
}

export async function delData(id: number): Promise<void> {
	return delJSON(`/data/${id}`);
}

export async function getTemplate(engine = 'dummy'): Promise<TemplateDTO> {
	return fetchJSON(
		`${__env === 'production' ? API_HOST : API_BASEURL}/calculations/template?engine=${engine}`,
		{ credentials: 'omit' }
	);
}

export async function getCalculations(): Promise<void> {
	return getJSON('/calculations');
}

export async function setCalculation(
	dataId: number,
	engine = 'dummy',
	input?: string
): Promise<void> {
	return postJSON('/calculations', { dataId, engine, input });
}

export async function delCalculation(id: number): Promise<void> {
	return delJSON(`/calculations/${id}`);
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

export async function getCollections(): Promise<void> {
	return getJSON('/collections');
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
		method: 'post',
		body: JSON.stringify(data),
		headers,
	});
}

export async function putJSON<T, U>(path: string, data: T, headers?: HttpHeaders): Promise<U> {
	const url = new URL(API_BASEURL + path);

	return fetchJSON<U>(url.toString(), {
		method: 'put',
		body: JSON.stringify(data),
		headers,
	});
}

export async function patchJSON<T, U>(path: string, data: T, headers?: HttpHeaders): Promise<U> {
	const url = new URL(API_BASEURL + path);

	return fetchJSON<U>(url.toString(), {
		method: 'patch',
		body: JSON.stringify(data),
		headers,
	});
}

export async function delJSON<T, U>(path: string, headers?: HttpHeaders): Promise<U> {
	const url = new URL(API_BASEURL + path);

	return fetchJSON<U>(url.toString(), {
		method: 'delete',
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
			userAsync.set(null);
			return null;
		}
		const err: HttpError = new Error(res.statusText);
		err.response = res;
		throw err;
	}

	if (res.status === 204) {
		return null;
	}

	return await res.json();
}
