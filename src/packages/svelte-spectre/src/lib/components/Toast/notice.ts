import { writable } from 'svelte/store';
import type { Icons } from '../../types/icons';
import type { Color } from '../../types/bg';
import type { Pos } from './positions';
import { positions } from './positions';

export type { Pos, Toast }

type Toast = {
	id?: number,
	type?: Color,
	title?: string,
	msg?: string,
	icon?: Icons,
	close?: boolean,
	timeout?: number,
	pos?: Pos
}

type Toasts = {
	pos: Toast[]
}

// function createToast() {

// 	const toasts = writable([]);
// 	const defopt: Toast = { close: true, timeout: 0, pos: 'top_center' }

// 	let curId = 1;

// 	// function createTimer(duration: number) {
// 	// 	return readable(duration, (set) => {
// 	// 		const timer = setInterval(() => {
// 	// 			duration > 0
// 	// 				? set((duration = duration - 1))
// 	// 				: clearInterval(timer);
// 	// 		}, 10);
// 	// 	});
// 	// }

// 	function send(toast: Toast): void {
// 		const id = curId++;
// 		toasts.update((state) => {
// 			state = state.filter((t) => t.timeout >= 0);
// 			return [...state, { id, ...toast }];
// 		});
// 		if (toast.timeout > 0) {
// 			setTimeout(() => {
// 				toasts.update((state) => {
// 					return [...state.filter((t) => t.id !== id)];
// 				});
// 			}, toast.timeout);
// 		}
// 	}
// 	function close(id: number) {
// 		toasts.update((state) => {
// 			return [...state.filter((t) => t.id !== id)];
// 		});
// 	}
// 	function clear() {
// 		toasts.set([]);
// 	}

// 	return {
// 		subscribe: toasts.subscribe,
// 		send,
// 		close,
// 		clear,
// 		default: (toast: Toast = {}) =>
// 			send({ msg: 'default', icon: 'message', ...defopt, ...toast }),
// 		error: (toast: Toast = {}) =>
// 			send({ type: 'error', icon: 'stop', ...defopt, ...toast }),
// 		warning: (toast: Toast = {}) =>
// 			send({ type: 'warning', icon: 'mail', ...defopt, ...toast }),
// 		primary: (toast: Toast = {}) =>
// 			send({ type: 'primary', icon: 'flag', ...defopt, ...toast }),
// 		success: (toast: Toast = {}) =>
// 			send({ type: 'success', icon: 'emoji', ...defopt, ...toast }),
// 	};
// }

let curId = 1;
const send = (toast: Toast, update: Function): void => {
	const { id = curId++, pos, ...rest } = toast;
	update((toast: Toast) => {
		const exist = () => {
			return Object.keys(toast).includes(pos) ? [...toast[pos]] : []
		}
		return { ...toast, [pos]: [...exist(), { id, pos, ...rest }] }
	});
	if (toast.timeout > 0) {
		setTimeout(() => close(id, pos, update), toast.timeout);
	}
}

const close = (id: number, pos: string, update: Function) => update((toast: Toast) => {
	return { ...toast, [pos]: [...toast[pos].filter((t: Toast) => t.id !== id)] };
});

const clear = (set: Function) => set([]);

const createToast = () => {
	const { subscribe, set, update } = writable({ top_center: [] });

	const opt: Toast = { close: true, timeout: 0, pos: 'top_center' }

	return {
		subscribe,
		send: (toast: Toast) => send(toast, update),
		close: (id: number, pos: string) => close(id, pos, update),
		clear: () => clear(set),
		default: (toast: Toast = {}) =>
			send({ msg: 'default', icon: 'message', ...opt, ...toast }, update),
		error: (toast: Toast = {}) =>
			send({ type: 'error', icon: 'stop', ...opt, ...toast }, update),
		warning: (toast: Toast = {}) =>
			send({ type: 'warning', icon: 'mail', ...opt, ...toast }, update),
		primary: (toast: Toast = {}) =>
			send({ type: 'primary', icon: 'flag', ...opt, ...toast }, update),
		success: (toast: Toast = {}) =>
			send({ type: 'success', icon: 'emoji', ...opt, ...toast }, update),
	};
};

export const notice = createToast();
