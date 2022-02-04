import { writable } from 'svelte/store';

export const confirmator = writable({
    open: false,
    args: undefined,
    message: 'Are you sure?',
    function: undefined,
});

export function withConfirm(fn, args, message = '', native) {
    if (!native) {
        confirmator.set({
            open: true,
            args,
            message,
            function: fn,
        });
    } else {
        return (...args) => {
            if (confirm(message)) {
                fn(...args);
            }
        };
    }
}
