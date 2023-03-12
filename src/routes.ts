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
		path: '/profile',
		component: () => import('@/pages/Profile.svelte'),
	},
	{
		path: '/todos',
		component: () => import('@/pages/Todos.svelte'),
		menu: {
			title: 'Tasks',
			pos: -1,
		},
	},
	{
		path: '/search',
		component: () => import('@/pages/Search.svelte'),
		menu: {
			title: 'Search',
			pos: 0,
		},
	},
	{
		path: '/datasources',
		component: () => import('@/pages/DataSources.svelte'),
		menu: {
			title: 'Data',
			pos: 1,
		},
	},
	{
		path: '/calculations',
		component: () => import('@/pages/Calculations.svelte'),
		menu: {
			title: 'Calculations',
			pos: 2,
		},
	},
	{
		path: '/materials',
		component: () => import('@/pages/Materials.svelte'),
		menu: {
			title: 'Materials',
			pos: 3,
		},
	},
	{
		path: '/collections',
		component: () => import('@/pages/Projects.svelte'),
		menu: {
			title: 'Organizer',
			pos: 4,
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
