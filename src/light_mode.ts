import 'core-js';
import { prefs } from 'svelte-pathfinder';

import '@/assets/global.css';

import { BASE_PATH } from '@/config';

import App from '@/App.svelte';

import type { Route } from '@/types/routes';

prefs.basePath = BASE_PATH;

const routes: Route[] = [
	{
		path: '/profile',
		component: () => import('@/pages/Profile.svelte'),
	},
	{
		path: '/tasks',
		component: () => import('@/pages/Tasks.svelte'),
		menu: {
			title: 'Requests',
			pos: -1,
		},
	},
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
];

const app = new App({
	target: document.body,
	props: { routes, mode: 'light' },
});

export default app;
