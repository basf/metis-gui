import 'core-js';
import { prefs } from 'svelte-pathfinder';

import '@/assets/global.css';

import App from '@/App.svelte';

prefs.array.format = 'separator';

const app = new App({
    target: document.body,
});

export default app;
