import { writable, get } from 'svelte/store';
import { getItem, setItem } from '@/helpers/storage';
import { media, type Queries } from '@/stores/media';

export const darkTheme = writable(
	getItem('xray_darkTheme', sessionStorage) ?? get<Queries>(media).dark
);
darkTheme.subscribe((val) => setItem('xray_darkTheme', val, sessionStorage));
