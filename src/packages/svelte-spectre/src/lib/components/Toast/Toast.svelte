<div
	class="toast {type && `toast-${type}`}"
	class:timeout={timeout > 0}
	style={timeout > 0 ? `--timeout: ${timeout}ms` : ''}
>
	<Grid align="center">
		{#if icon}
			<Col col="auto">
				<Icon {icon} />
			</Col>
		{/if}
		<Col inset="py-2">
			<slot><p>Default text</p></slot>
		</Col>
		{#if closable}
			<IconButton icon="cross" on:click={() => dispatch('close', 'любые данные')} />
		{/if}
	</Grid>
</div>

<script context="module" lang="ts">
	import { IconButton } from '../Button';
	import { Icon } from '../Icon';
	import { Grid, Col } from '../../layouts/Grid/';

	import type { Color } from '../../types/bg';
	import type { Icons } from '../../types/icons';
	export type { Color };
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let icon: Icons = 'emoji';
	export let type: Color = 'initial';
	export let timeout: number = 0;
	export let closable = false;
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
				// position: absolute;
				// top: 0;
				// right: 0;
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
			&::after {
				content: '';
				display: flex;
				opacity: 0;
				position: absolute;
				left: -1px;
				right: -1px;
				bottom: -1px;
				height: 0.36em;
				background: $bg-color;
				transform: scaleX(1);
				transition: transform var(--timeout);
			}
			&.timeout::after {
				opacity: 0.69;
				transform: scaleX(0);
				transform-origin: bottom right;
			}
			:global(p) {
				white-space: pre-line;
				margin-bottom: 0;
			}
		}
	}
</style>
