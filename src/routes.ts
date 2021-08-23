import type { Props } from 'svelte-viewpoint';

type MenuProp = {
    title: string;
    icon?: string;
    pos?: number;
    path?: string;
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
            path: '',
        }
    },
    {
        path: '/materials',
        component: () => import('@/pages/Empty.svelte'),
        menu: {
            title: 'Materials',
            path: '',
        }
    },
    {
        path: '/projects',
        component: () => import('@/pages/Empty.svelte'),
        menu: {
            title: 'Projects',
            path: '',
        }
    },
    {
        path: '/',
        component: () => import('@/pages/Calculations.svelte'),
        menu: {
            title: 'Calculations',
            pos: 0
        }
    },
];

const menu = routes
    .reduce<MenuProp[]>((items, { path, menu }, i) => {
        return !!menu && items.push({ path, pos: i + 1, ...menu }), items;
    }, [])
    .sort((a, b) => (a.pos > b.pos ? 1 : -1));

export { menu };
export default routes;
