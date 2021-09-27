import { writable } from 'svelte/store';
import type { Icons } from '../../types/icons';
import type { Color } from '../../types/bg';
import type { Pos } from './positions';

export type { Pos, Tost }

type Tost = {
	id?: number,
	type?: Color,
	title?: string,
	msg?: string,
	icon?: Icons,
	close?: boolean,
	timeout?: number,
	init?: number,
	next?: number,
	pause?: boolean,
	pos?: Pos
}

const defaults: Tost = { close: true, timeout: 0, init: 1, next: 0, pos: 'top_center' }

function createToast() {
	const { subscribe, set, update } = writable([]);

	let curId = 0

	const send = (toast: Tost) => {
		toast.id = curId++
		update((state) => {
			state = state.filter((t) => t.timeout >= 0);
			return [...state, { ...defaults, ...toast }];
		});
	}
	const close = (id: number) => {
		update((state) => {
			return [...state.filter((t) => t.id !== id)];
		});
	}
	const clear = () => {
		set([]);
	}

	return {
		subscribe,
		send,
		close,
		clear,
		default: (toast: Tost = {}) =>
			send({ msg: 'default', icon: 'message', ...toast }),
		error: (toast: Tost = {}) =>
			send({ type: 'error', icon: 'stop', ...toast }),
		warning: (toast: Tost = {}) =>
			send({ type: 'warning', icon: 'mail', ...toast }),
		primary: (toast: Tost = {}) =>
			send({ type: 'primary', icon: 'flag', ...toast }),
		success: (toast: Tost = {}) =>
			send({ type: 'success', icon: 'emoji', ...toast }),
	};
}

export const toast = createToast();



// function createTimer(duration: number) {
// 	return readable(duration, (set) => {
// 		const timer = setInterval(() => {
// 			duration > 0
// 				? set((duration = duration - 1))
// 				: clearInterval(timer);
// 		}, 10);
// 	});
// }

// let curId = 1;
// const send = (toast: Tost, update: Function): void => {
// 	const { id = curId++, pos, ...rest } = toast;
// 	update((toast: Tost) => {
// 		const exist = () => {
// 			if (pos in toast) return [...toast[pos]]
// 		}
// 		return { ...toast, [pos]: [...exist() || [], { id, pos, ...rest }] }
// 	});
// 	if (toast.timeout > 0) {
// 		setTimeout(() => close(id, pos, update), toast.timeout);
// 	}
// }

// const close = (id: number, pos: string, update: Function) => update((toast: Tost) => {
// 	return { ...toast, [pos]: [...toast[pos].filter((t: Tost) => t.id !== id)] };
// });

// const clear = (set: Function) => set([]);

// const createToast = () => {
// 	const { subscribe, set, update } = writable({ top_center: [] });

// 	const opt: Tost = { close: true, timeout: 0, pos: 'top_center' }

// 	return {
// 		subscribe,
// 		set,
// 		send: (toast: Tost) => send(toast, update),
// 		close: (id: number, pos: string) => close(id, pos, update),
// 		clear: () => clear(set),
// 		default: (toast: Tost = {}) =>
// 			send({ msg: 'default', icon: 'message', ...opt, ...toast }, update),
// 		error: (toast: Tost = {}) =>
// 			send({ type: 'error', icon: 'stop', ...opt, ...toast }, update),
// 		warning: (toast: Tost = {}) =>
// 			send({ type: 'warning', icon: 'mail', ...opt, ...toast }, update),
// 		primary: (toast: Tost = {}) =>
// 			send({ type: 'primary', icon: 'flag', ...opt, ...toast }, update),
// 		success: (toast: Tost = {}) =>
// 			send({ type: 'success', icon: 'emoji', ...opt, ...toast }, update),
// 	};
// };
