import type { Props } from 'svelte-viewpoint';

type MenuProp = {
    title: string;
    path?: string;
    pos?: number;
    icon?: string;
    badge?: string;
    clear?: boolean;
};

export interface Route {
    path: string;
    component: Props['component'];
    menu?: MenuProp;
}

const routes: Route[] = [
    {
        path: '/login',
        component: () => import('@/pages/Login.svelte'),
    },
    {
        path: '/profile',
        component: () => import('@/pages/Profile.svelte'),
    },
    {
        path: '/data',
        component: () => import('@/pages/Empty.svelte'),
        menu: {
            title: 'Data',
            icon: 'emoji',
        },
    },
    {
        path: '/materials',
        component: () => import('@/pages/Empty.svelte'),
        menu: {
            title: 'Materials',
            clear: true,
        },
    },
    {
        path: '/projects',
        component: () => import('@/pages/Empty.svelte'),
        menu: {
            title: 'Projects',
        },
    },
    {
        path: '/search',
        component: () => import('@/pages/Search.svelte'),
        menu: {
            title: 'Search',
        },
    },
    {
        path: '/',
        component: () => import('@/pages/Calculations.svelte'),
        menu: {
            title: 'Calculations',
            pos: 0,
            badge: '9',
        },
    },
];

const menu = routes
    .reduce<MenuProp[]>((items, { path, menu }, i) => {
        return !!menu && items.push({ path, pos: i + 1, ...menu }), items;
    }, [])
    .sort((a, b) => (a.pos > b.pos ? 1 : -1));

export { menu };
export default routes;
