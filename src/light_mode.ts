import 'core-js';
import { prefs } from 'svelte-pathfinder';

import '@/assets/global.css';

import { BASE_PATH } from '@/config';

import App from '@/App.svelte';

import type { Route } from '@/types/routes';

prefs.basePath = BASE_PATH;

const routes: Route[] = [
	{
		path: '/data',
		component: () => import('@/pages/Data.svelte'),
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
	props: { routes },
});

export default app;
