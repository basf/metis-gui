<div class="toast {tost.type && `toast-${tost.type}`}" on:mouseenter={pause} on:mouseleave={resume}>
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
		<Progress bind:progress bind:value {next} {options} {invert} />
	{/if}
</div>

<script context="module" lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { IconButton } from '../Button';
	import { Icon } from '../Icon';
	import { Grid, Col } from '../../layouts/Grid';
	import { Progress } from '../Progress';

	import type { Tweened } from 'svelte/motion';
	import type { Tost } from './toast';
	import type { Options } from '../Progress';
	import type { Color } from '../../types/bg';
	import type { Icons } from '../../types/icons';

	export type { Color, Icons };
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let tost: Tost;
	export let invert: boolean = false;
	export let next: number;
	export let options: Options;
	export let value: number;
	export let progress: Tweened<number>;

	let start: number, remaining: number;

	onMount(() => {
		dispatch('mount', 'this toast mounted');
		next = tost.progress;
		start = Date.now();
		remaining = tost.timeout;
		options = { duration: remaining };
		// progress.set(tprogress, { duration: ttimeout });
	});

	onDestroy(() => {
		dispatch('destroy', 'this toast mounted');
		next = 1;
		options = { duration: 0 };
		// progress.set(1, { duration: 0 });
	});

	function pause() {
		dispatch('hover', 'this toast hovered');
		remaining -= Date.now() - start;
		next = value;
		options = { duration: 0 };
		// progress.set($progress, { duration: 0 });
	}
	function resume() {
		dispatch('leave', 'this toast leaved');
		start = Date.now();
		next = tost.progress;
		options = { duration: remaining };
		// progress.set(tprogress, { duration: tprogress });
	}
	function close() {
		dispatch('close', 'this toast closing');
		next = 1;
		options = { duration: 0 };
		// progress.set(1, { duration: 0 });
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
				p {
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
