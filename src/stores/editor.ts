import { writable } from 'svelte/store';
import { getItem, setItem } from '@/helpers/storage';
import type { Template } from '@/types/dto';

export const editorCode = writable<Template>(
	getItem('xray_EditorCode', sessionStorage) ?? '{}' as unknown as Template
);
editorCode.subscribe((val) => setItem('xray_EditorCode', val, sessionStorage));
