import { COLORSET, VISIBILITY } from './const';

export interface Stream<T> {
	data: T;
	reqId?: string;
}

export interface Timestamps {
	createdAt?: string;
	updatedAt?: string;
}

export interface Calculation extends Timestamps {
	id: number;
	name: string;
	userId: number;
	status: number;
	progress: number;
	result?: DataSource[];
}

export interface DataSource extends Timestamps {
	id: number;
	userId: number;
	userFirstName: string;
	userLastName: string;
	userEmail: string;
	name: string;
	content: string;
	type: number;
	collections: Collection[];
	progress: number;
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
	template?: string;
	schema?: any;
	input?: string;
}

export type CollectionFlavor = typeof COLORSET[number];
export type CollectionVisibility = typeof VISIBILITY[number];

export interface CollectionType extends Timestamps {
	id: number;
	slug: string;
	label: string;
	color: CollectionFlavor;
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
	typeFlavor?: CollectionFlavor;

	dataSources?: number[];
	users?: number[];
}
