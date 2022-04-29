import { writable, get } from 'svelte/store';
import { getItem, setItem } from '@/helpers/storage';
import type { Template } from '@/types/dto';

export const EditorCode = writable<Template>(
	getItem('xray_EditorCode', sessionStorage) ?? '{}' as unknown as Template
);
EditorCode.subscribe((val) => setItem('xray_EditorCode', val, sessionStorage));
