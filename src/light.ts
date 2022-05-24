import 'core-js';
import { prefs } from 'svelte-pathfinder';

import '@/assets/global.css';

import { BASE_PATH } from '@/config';

import App from '@/App.svelte';

import type { Route } from '@/types/routes';

prefs.basePath = BASE_PATH;

const routes: Route[] = [
	// {
	// 	path: '/profile',
	// 	component: () => import('@/pages/Profile.svelte'),
	// },
	// {
	// 	path: '/search',
	// 	component: () => import('@/pages/Search.svelte'),
	// 	menu: {
	// 		title: 'Search',
	// 		pos: 0,
	// 	},
	// },
	{
		path: '/',
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
	// {
	// 	path: '/materials',
	// 	component: () => import('@/pages/Empty.svelte'),
	// 	menu: {
	// 		title: 'Materials',
	// 		pos: 3,
	// 	},
	// },
	// {
	// 	path: '/collections',
	// 	component: () => import('@/pages/Projects.svelte'),
	// 	menu: {
	// 		title: 'Projects',
	// 		pos: 4,
	// 	},
	// },
];

const app = new App({
	target: document.body,
	props: { routes },
});

export default app;
