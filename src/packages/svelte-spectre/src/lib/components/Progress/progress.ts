import { tweened } from 'svelte/motion';
import { linear } from 'svelte/easing';

import type { Tweened } from 'svelte/motion';

type Options = {
    delay?: number;
    duration?: number;
    easing?: (t: number) => number;
    interpolate?: (a: number, b: number) => (t: number) => number;
};

const defaults: Options = { delay: 0, duration: 0, easing: linear };
const progress: Tweened<number> = tweened(1, { ...defaults });

export { progress }
export type { Options }
