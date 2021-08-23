import 'core-js';
import { prefs } from 'svelte-pathfinder';

import '@/assets/global.css';

import { BASE_PATH } from '@/config';

import App from '@/App.svelte';

prefs.array.format = 'separator';
prefs.basePath = BASE_PATH;

const app = new App({
    target: document.body,
});

export default app;
