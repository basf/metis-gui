<div class="toast {tost.type && `toast-${tost.type}`}" use:pausable={$progress > 0}>
	<Grid align="center">
		{#if tost.icon}
			<Col col="auto">
				<Icon icon={tost.icon} />
			</Col>
		{/if}
		<Col inset="py-2">
			<slot>Default text</slot>
		</Col>
		{#if tost.close}
			<IconButton icon="cross" on:click={close} />
		{/if}
	</Grid>
	{#if tost.timeout}
		<Progress value={$progress} {invert} />
	{/if}
</div>

<script context="module" lang="ts">
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import { IconButton } from '../Button';
	import { Icon } from '../Icon';
	import { Grid, Col } from '../../layouts/Grid';
	import { Progress } from '../Progress';
	import { toast } from './toast';

	import type { Tweened } from 'svelte/motion';
	import type { Tost } from './toast';
	import type { Options } from '../Progress';
	import type { Color } from '../../types/bg';
	import type { Icons } from '../../types/icons';

	export type { Color, Icons, Tost };
</script>

<script lang="ts">
	export let tost: Tost;
	export let invert: boolean = false;
	export let next: number = tost.init;
	export let options: Options;
	export let value: number;

	const defaults: Options = { delay: 0, duration: 5000, easing: linear };
	const progress: Tweened<number> = tweened(tost.init, { ...defaults });

	const autoclose = () => ($progress === 1 || $progress === 0) && toast.close(tost.id);

	function pausable(node: HTMLElement, paused: boolean) {
		return {
			update(paused: boolean) {
				node.onmouseenter = pause;
				node.onmouseleave = resume;
			},
			destroy() {
				node.onmouseenter = null;
				node.onmouseleave = null;
			},
		};
	}

	$: if (next !== tost.next) {
		start = Date.now();
		next = tost.next;
		remaining = tost.timeout;
		progress.set(next, { duration: remaining }).then(autoclose);
	}

	let start: number, remaining: number;

	function pause() {
		remaining -= Date.now() - start;
		options = { duration: 0 };
		progress.set($progress, { duration: 0 });
	}
	function resume() {
		start = Date.now();
		options = { duration: remaining };
		next = tost.next;
		progress.set(next, { duration: remaining }).then(autoclose);
	}
	function close() {
		next = 1;
		options = { duration: 0 };
		progress.set(1, { duration: 0 }).then(autoclose);
	}
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/toasts';

		.toast {
			max-width: 300px;
			position: relative;
			padding-top: 0;
			padding-bottom: 0;
			:global(.btn-link) {
				color: currentColor;
				opacity: 1;
				&:hover,
				&:active,
				&:focus {
					background: rgba($bg-color, 0.5);
					opacity: 0.95;
					color: inherit;
				}
			}
			:global {
				* {
					margin: 0;
				}
				.progress {
					position: absolute;
					inset: -1px;
					top: auto;
					width: calc(100% + 2px);
					opacity: 0.69;
					background: transparent;
				}
			}
		}
	}
</style>
