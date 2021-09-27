<progress
	class="progress {color && `text-${color}`}"
	class:progress-invert={invert}
	{value}
	{max}
/>

<script context="module" lang="ts">
	import type { Color } from '../../types/bg';
	export type { Color };
</script>

<script lang="ts">
	export let max: number = 0;
	export let invert: boolean = false;
	export let color: Color = 'secondary';
	export let value: number;
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
