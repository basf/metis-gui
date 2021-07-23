import { API_BASEURL } from '@/config';

export interface HttpError extends Error {
    response?: Response;
}
export type HttpHeaders = Record<string, string>;
export type QueryParams = Record<string, unknown>;

export async function getCounter(): Promise<void>  {
    return getJSON('/counter');
}

export async function setCounter(counter: number): Promise<void> {
    return postJSON('/counter', { counter });
}

export async function login(login: string, password: string): Promise<any> {
    return postJSON('/users/login', { login, password });
}

export async function logout(): Promise<any> {
    return delJSON('/users/login');
}

export async function me(): Promise<any> {
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
