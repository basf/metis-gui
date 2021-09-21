import { readable, writable, derived, get } from 'svelte/store';
import type { Icons } from '../../types/icons';

function createToast() {
	const options = {
		message: 'toast',
		type: 'default',
		timeout: 0,
		title: '',
		close: true,
	};

	function createTimer(duration: number) {
		return readable(duration, (set) => {
			const timer = setInterval(() => {
				duration > 0
					? set((duration = duration - 1))
					: clearInterval(timer);
			}, 10);
		});
	}

	const toasts = writable([]);

	let currentId = 1;

	function send(
		message: string = 'noticy',
		type: string = 'default',
		timeout: number = 0,
		title: string = '',
		close: boolean = true,
		icon: Icons
	) {
		const id = currentId++;
		toasts.update((state) => {
			state = state.filter((n) => n.timeout > 0);
			return [
				...state,
				{ id, type, message, timeout, title, close, icon },
			];
		});
		if (timeout > 0) {
			setTimeout(() => {
				toasts.update((state) => {
					return [...state.filter((n) => n.id !== id)];
				});
			}, timeout);
		}
	}
	function close(id: number) {
		toasts.update((state) => {
			return [...state.filter((n) => n.id !== id)];
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
		default: (msg, timeout, title, close) =>
			send(msg, 'default', timeout, title, close),
		error: (msg, timeout, title, close, icon: Icons = 'stop') =>
			send(msg, 'error', timeout, title, close, icon),
		warning: (msg, timeout, title, close) =>
			send(msg, 'warning', timeout, title, close),
		primary: (msg, timeout, title, close) =>
			send(msg, 'primary', timeout, title, close),
		success: (msg, timeout, title, close) =>
			send(msg, 'success', timeout, title, close),
	};
}

export const notice = createToast();
