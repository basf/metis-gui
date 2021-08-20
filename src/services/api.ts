import { API_BASEURL } from '@/config';
import type { User as UserDTO } from '@/types/dto'; 

export interface HttpError extends Error {
    response?: Response;
}
export type HttpHeaders = Record<string, string>;
export type QueryParams = Record<string, unknown>;

export async function getData(): Promise<void>  {
    return getJSON('/data');
}

export async function setData(content: string): Promise<void> {
    return postJSON('/data', { content });
}

export async function delData(uuid: string): Promise<void>  {
    return putJSON(`/data`, { uuid });
}

export async function getCalculations(): Promise<void>  {
    return getJSON('/calculations');
}

export async function getCalculation(uuid: string): Promise<void>  {
    return getJSON(`/calculations/${uuid}`);
}

export async function setCalculation(uuid: string): Promise<void> {
    return postJSON('/calculations', { uuid });
}

export async function delCalculation(uuid: string): Promise<void>  {
    return putJSON(`/calculations`, { uuid });
}

export async function login(login: string, password: string): Promise<void> {
    return postJSON('/users/login', { login, password });
}

export async function logout(): Promise<void> {
    return delJSON('/users/login');
}

export async function me(): Promise<UserDTO> {
    return getJSON('/users/me');
}

export async function getJSON<T>(
    path: string,
    params?: QueryParams,
    headers?: HttpHeaders
): Promise<T> {
    const url = new URL(API_BASEURL + path);

    if (params) {
        Object.entries(params).forEach((param: [string, string]) =>
            url.searchParams.append(...param)
        );
    }

    return fetchJSON(url.toString(), { headers });
}

export async function postJSON<T, U>(
    path: string,
    data: T,
    headers?: HttpHeaders
): Promise<U> {
    const url = new URL(API_BASEURL + path);

    return fetchJSON<U>(url.toString(), {
        method: 'post',
        body: JSON.stringify(data),
        headers,
    });
}

export async function putJSON<T, U>(
    path: string,
    data: T,
    headers?: HttpHeaders
): Promise<U> {
    const url = new URL(API_BASEURL + path);

    return fetchJSON<U>(url.toString(), {
        method: 'put',
        body: JSON.stringify(data),
        headers,
    });
}

export async function delJSON<U>(
    path: string,
    headers?: HttpHeaders
): Promise<U> {
    const url = new URL(API_BASEURL + path);

    return fetchJSON<U>(url.toString(), {
        method: 'delete',
        headers,
    });
}


export default async function fetchJSON<T>(
    url: string,
    { headers, ...options }: RequestInit = {}
): Promise<T> {    
    const req = new Request(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        credentials: 'include',
        mode: 'cors',
    });

    const res = await fetch(req);

    if (!res.ok) {
        const err: HttpError = new Error(res.statusText);
        err.response = res;
        throw err;
    }

    if (res.status === 204) {
        return null;
    }

    return await res.json();
}
