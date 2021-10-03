<label
	id="range-{fid}"
	class="is-{validity}"
	class:form-inline={inline}
	style="--range: {range}%;"
	data-range={range}
>
	{label}
	<input class="slider" type="range" bind:value={range} {min} {max} on:input on:change />
</label>

<script lang="ts" context="module">
	import uuid from '../../helpers/uuid';

	type Validity = 'success' | 'error' | false;

	export type { Validity };
</script>

<script lang="ts">
	export let label: string;
	export let range: number = 50;
	export let min: number = 0;
	export let max: number = 100;
	export let inline: boolean = false;
	export let validity: Validity = false;

	const fid: string = uuid();
</script>

<style lang="scss">
	@import 'spectre.css/src/sliders';

	label[id^='range-'] {
		display: block;
		position: relative;

		output {
			position: absolute;
			left: var(--range);
			transform: translateX(-50%);
		}
		&:not([data-tooltip]) {
			&::after {
				content: attr(data-range);
				position: absolute;
				left: var(--range);
				transform: translate(-50%, -100%);
				color: $light-color;
				background: rgba($dark-color, 0.95);
				padding: $unit-1 $unit-2;
				border-radius: $border-radius;
				transition: opacity 250ms, transform 250ms;
				opacity: 0;
			}
		}
		&:hover {
			&:not([data-tooltip]) {
				&::after {
					opacity: 1;
					transform: translate(-50%, -200%);
				}
			}
		}
	}
	input[type='range'] {
		--size: 60px;
		--color: $bg-color-dark;
		--background: $primary-color;
		--direction: to right;
		width: 100%;

		//webkit
		&::-webkit-slider-runnable-track {
			height: 3px;
			background: linear-gradient(
				var(--direction),
				$primary-color var(--range, 0%),
				$bg-color-dark var(--range, 0%)
			);
			border-radius: 5px;
		}
		&::-webkit-slider-thumb {
			transform: translateX(calc(var(--range) - 50%));
		}
		&:hover::-webkit-slider-thumb {
			transform: translateX(calc(var(--range) - 50%)) scale(1.25) !important;
		}
		&:active::-webkit-slider-thumb {
			border: 3px solid rgba($primary-color, 0.27);
			transform: inherit;
		}

		//moz
		&::-moz-range-track {
			height: 3px;
			background: linear-gradient(
				var(--direction),
				$primary-color var(--range, 0%),
				$bg-color-dark var(--range, 0%)
			);
			border-radius: 5px;
		}
		&::-moz-range-thumb {
			transform: translateX(calc(var(--range) - 50%));
			outline: 3px;
			transition: outline 250ms;
		}
		&:hover::-moz-range-thumb {
			transform: translateX(calc(var(--range) - 50%)) scale(1.25) !important;
		}
		&:active::-moz-range-thumb {
			outline: 3px solid transparentize($primary-color, 0.73);
			transform: inherit;
		}
	}
</style>
