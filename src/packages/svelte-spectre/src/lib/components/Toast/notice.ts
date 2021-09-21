import { writable } from 'svelte/store';
import type { Icons } from '../../types/icons';
import type { Color } from '../../types/bg';

export type Toast = {
	id?: number,
	type?: Color,
	title?: string,
	msg?: string,
	icon?: Icons,
	close?: boolean,
	timeout?: number,
}
function createToast() {
	// let toast: Toast = {
	// 	type: '',
	// 	title: '',
	// 	msg: '',
	// 	icon: '',
	// 	close: true,
	// 	timeout: 0,
	// };

	// function createTimer(duration: number) {
	// 	return readable(duration, (set) => {
	// 		const timer = setInterval(() => {
	// 			duration > 0
	// 				? set((duration = duration - 1))
	// 				: clearInterval(timer);
	// 		}, 10);
	// 	});
	// }

	const toasts = writable([]);

	let curId = 1;

	function send(toast: Toast): void {
		const id = curId++;
		toasts.update((state) => {
			state = state.filter((t) => t.timeout > 0);
			return [...state, { id, ...toast }];
		});
		if (toast.timeout > 0) {
			setTimeout(() => {
				toasts.update((state) => {
					return [...state.filter((t) => t.id !== id)];
				});
			}, toast.timeout);
		}
	}
	function close(id: number) {
		toasts.update((state) => {
			return [...state.filter((t) => t.id !== id)];
		});
	}
	function clear() {
		toasts.set([]);
	}

	return {
		subscribe: toasts.subscribe,
		send,
		close,
		clear,
		default: (toast: Toast) =>
			send({ ...toast, msg: 'default', icon: 'message' }),
		error: (toast: Toast) =>
			send({ ...toast, type: 'error', icon: 'stop' }),
		warning: (toast: Toast) =>
			send({ ...toast, type: 'warning', icon: 'mail' }),
		primary: (toast: Toast) =>
			send({ ...toast, type: 'primary', icon: 'flag' }),
		success: (toast: Toast) =>
			send({ ...toast, type: 'success', icon: 'emoji' }),
	};
}

export const notice = createToast();
