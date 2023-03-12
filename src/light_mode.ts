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
		path: '/todos',
		component: () => import('@/pages/Todos.svelte'),
		menu: {
			title: 'Tasks',
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
	{
		path: '/materials',
		component: () => import('@/pages/Materials.svelte'),
		menu: {
			title: 'Materials',
			pos: 3,
		},
	},
	{
		path: '/projects',
		component: () => import('@/pages/Projects.svelte'),
		menu: {
			title: 'Organizer',
			pos: 4,
		},
	},
];

const app = new App({
	target: document.body,
	props: { routes, mode: 'light' },
});

export default app;
