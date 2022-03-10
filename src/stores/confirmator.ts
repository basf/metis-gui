import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

interface Confirm {
    open: boolean,
    args: any,
    message: string,
    function?: (args: any) => any,
}
export const confirmator: Writable<Confirm> = writable<Confirm>({
    open: false,
    args: {},
    message: 'Are you sure?',
    function: undefined,
});

export function withConfirm(fn: (args: any) => any, args: any, message = '', native: boolean) {
    if (!native) {
        confirmator.set({
            open: true,
            args,
            message,
            function: fn,
        });
    } else {
        return (...args: any) => {
            if (confirm(message)) {
                fn(args);
            }
        };
    }
}
