<progress
	class="progress {color && `text-${color}`}"
	class:progress-invert={invert}
	{value}
	{max}
/>

<script context="module" lang="ts">
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';

	import type { Tweened } from 'svelte/motion';
	import type { Color } from '../../types/bg';

	type Options = {
		delay?: number;
		duration?: number;
		easing?: (t: number) => number;
		interpolate?: (a: number, b: number) => (t: number) => number;
	};

	export type { Color, Options };
</script>

<script lang="ts">
	export let max: number = 0;
	export let invert: boolean = false;
	export let color: Color = 'secondary';
	export let next: number = 0;
	export let options: Options;
	export let value: number;
	let pr = 0;

	const defaults: Options = { delay: 0, duration: 5000, easing: linear };
	export const progress: Tweened<number> = tweened(1, { ...defaults });

	$: value = $progress;
	$: progress.set(next, { ...options });

	$: value && console.log(pr++);

	// function mount(t: Tost) {
	// 	progress.set(t.progress, { duration: t.timeout });
	// }
	function pause() {
		progress.set($progress, { duration: 0 });
	}
	function resume(value: number, duration: number) {
		progress.set(value, { duration: duration });
	}
	function destroy() {
		progress.set(1, { duration: 0 });
	}
	// function close(t: Tost) {
	// 	progress.set(0, { duration: 0 });
	// 	toast.close(t.id);
	// }

	export { pause, resume, destroy };
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/progress';

		.progress {
			--progress-color: currentColor;

			&::-webkit-progress-bar {
				background: transparent;
			}

			&::-webkit-progress-value {
				background: var(--progress-color, $primary-color);
			}

			&::-moz-progress-bar {
				background: var(--progress-color, $primary-color);
			}
			&.progress-invert {
				transform: scaleX(-1);
			}
		}
	}
</style>
