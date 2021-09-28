import { tweened } from 'svelte/motion';
import { linear } from 'svelte/easing';
import { derived, writable } from 'svelte/store';
import { Timer } from '../Toast/timer'

import type { Tweened } from 'svelte/motion';
import type { Tost } from '../Toast/toast';

type Options = {
    delay?: number;
    duration?: number;
    easing?: (t: number) => number;
    interpolate?: (a: number, b: number) => (t: number) => number;
};

let options: Options, curId = 0, timer: Timer;

function createProgress() {
    const defaults: Options = { delay: 0, duration: 5000, easing: linear };
    const progress: Tweened<number> = tweened(1, { ...defaults, ...options });
    const progressed = writable([])
    const items = derived([progress, progressed], ([$progress, $progressed], set) => {
        set([...$progressed, $progress])
    }, []);

    const start = (progress: Tweened<number>): void => {
        toast.id = curId++
        items.update((state) => {
            state = state.filter((t) => t.timeout >= 0);
            return [...state, progress];
        });
        if (toast.timeout > 0) {
            timer = new Timer(() => {
                items.update((state) => {
                    return [...state.filter((t) => t.id !== toast.id)];
                });
            }, toast.timeout);
        }
    }
    const pause = () => timer.pause()
    const resume = () => timer.resume()
    const close = (id: number) => {
        items.update((state) => {
            return [...state.filter((t) => t.id !== id)];
        });
        timer.clear();
    }
    const clear = () => {
        items.set([]);
        timer.clear();
    }

    return {
        subscribe: items.subscribe,
        start,
        pause,
        resume,
        close,
        clear,
    };
}

export type { Options }
export const progress = createProgress()
