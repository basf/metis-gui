import { API_BASEURL } from '@/config';

export interface HttpError extends Error {
    response?: Response;
}
export type HttpHeaders = Record<string, string>;
export type QueryParams = Record<string, unknown>;

export async function login(login: string, password: string): Promise<any> {
    const body = new FormData();
    body.append('login', login);
    body.append('password', password);

    return fetchJSON(API_BASEURL + '/users/login', {
        method: 'post',
        body,
    });
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

    return fetchJSON(url.toString(), {
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
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
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
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
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
}

export default async function fetchJSON<T>(
    url: string,
    init?: RequestInit
): Promise<T> {
    const req = new Request(url, init);

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
