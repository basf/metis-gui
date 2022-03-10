export interface Timestamps {
    created_at: string;
    updated_at: string;
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

export interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
}

export interface Error {
    status: number;
    error: { message: string } | string;
}

export interface Template {
    template: string;
    schema: any;
}
