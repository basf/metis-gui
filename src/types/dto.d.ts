import { COLORSET, VISIBILITY } from './const';

export interface Timestamps {
    createdAt?: string;
    updatedAt?: string;
}

export interface Calculation extends Timestamps {
    id: number;
    name: string;
    userId: number;
    status: number;
}

export interface DataSource extends Timestamps {
    id: number;
    userId: number;
    name: string;
    content: string;
    type: number;
}

export interface User extends Timestamps { 
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified?: boolean;
    roleLabel?: string;
    roleSlug?: string;
    permissions?: unknown;
    provider?: string;
}

export interface Error {
    status: number;
    error: { message: string } | string;
}

export interface Template {
    template: string;
    schema: any;
}

export type CollectionColor = typeof COLORSET[number];
export type CollectionVisibility = typeof VISIBILITY[number];

export interface CollectionType extends Timestamps {
    id: number;
    slug: string;
    label: string;
    color: CollectionColor;
}

export interface Collection extends Timestamps {
    id: number;
    title: string;
    description: string;
    visibility: CollectionVisibility;

    userId: number;
    userFirstName?: string;
    userLastName?: string;
    typeId: number;
    typeSlug?: string;
    typeLabel?: string;
    typeColor?: CollectionColor;

    dataSources?: number[];
    users?: number[];
}