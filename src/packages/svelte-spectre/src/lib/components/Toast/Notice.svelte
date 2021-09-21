<section class="noticy container p-absolute">
	{#each $notice as toast (toast.id)}
		<div
			animate:flip
			style={toast.timeout && `--timeout: ${toast.timeout}ms`}
			class:timeout={timered.includes(toast.id)}
			class="toast {toast.type ? `toast-${toast.type}` : ''} my-1"
			on:introstart={(e) => checkTimeout(toast)}
			in:fly={{ y: -48 }}
			out:fade
		>
			{#if toast.close}
				<Button
					variant="clear"
					class="float-right c-hand"
					on:click={(e) => notice.close(toast.id)}
				/>
			{/if}
			{#if toast.icon}
				<Grid align="center">
					<Col col="auto">
						<Icon icon={toast.icon} size="2x" />
					</Col>
					<Col>
						{#if toast.title}<h5>{toast.title}</h5>{/if}
						<p>{toast.msg}</p>
					</Col>
				</Grid>
			{:else}
				{#if toast.title}<h5>{toast.title}</h5>{/if}
				<p>{toast.msg}</p>
			{/if}
		</div>
	{/each}
</section>

<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly, fade } from 'svelte/transition';

	import { notice, Toast } from './notice';

	import { Button, Icon } from '../../components';
	import { Grid, Col } from '../../layouts';

	let timered: number[] = [];

	function checkTimeout(toast: Toast) {
		if (toast.timeout > 0) timered = [...timered, toast.id];
	}
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/toasts';
	}
	.noticy {
		z-index: 99;
		top: 1em;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		max-width: 300px;
		left: 50%;
		transform: translateX(-50%);
	}
	.toast {
		max-width: 300px;
		position: relative;
		&::after {
			content: '';
			display: flex;
			opacity: 0.69;
			position: absolute;
			left: -1px;
			right: -1px;
			bottom: -1px;
			height: 4.5px;
			transform: scaleX(1);
			transition: transform var(--timeout);
		}
		&.timeout::after {
			background: #fff;
			transform: scaleX(0);
			transform-origin: bottom right;
		}
		p {
			white-space: pre-line;
		}
	}
</style>
