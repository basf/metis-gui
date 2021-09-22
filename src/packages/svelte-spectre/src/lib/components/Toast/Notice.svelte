{#each $notice as toast (toast.id)}
	<div
		animate:flip
		style="--nextpos: {nextpos}%; {toast.timeout && `--timeout: ${toast.timeout}ms`}"
		class:timeout={timered.includes(toast.id)}
		class="toast {toast.type ? `toast-${toast.type}` : ''} m-2 pos-{toast.pos}"
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

<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly, fade } from 'svelte/transition';

	import { notice, Toast } from './notice';

	import { Button, Icon } from '../../components';
	import { Grid, Col } from '../../layouts';

	let timered: number[] = [];

	function checkTimeout(toast: Toast) {
		if (toast.timeout > 0) timered = [...timered, toast.id];
		else timered = [];
	}
	$: console.log($notice.length ? '1' : '0');
	const spectre = document.querySelector('.notices');
	let pos = 'top-center',
		nextpos = 0;

	$: nextpos = $notice.length * 10;
	// onMount(() => (spectre = document.querySelector('.spectre')));
	function portalAction(node: Element, parent: Element): void {
		parent = parent || document.body;
		parent.appendChild(node);
	}
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/toasts';
		.toast {
			max-width: 300px;
			position: relative;
			&.pos {
				&-top-center {
					top: 0;
					left: 50%;
					transform: translate(-50%, 0);
				}
				&-top-right {
					top: 0;
					right: 0;
				}
				&-center-right {
					top: 50%;
					right: 0;
					transform: translate(0, -50%);
				}
				&-bottom-right {
					bottom: 0;
					right: 0;
				}
				&-bottom-center {
					bottom: 0;
					left: 50%;
					transform: translate(-50%, 0);
				}
				&-bottom-left {
					bottom: 0;
					left: 0;
				}
				&-center-left {
					top: 50%;
					left: 0;
					transform: translate(0, -50%);
				}
				&-top-left {
					top: 0;
					left: 0;
				}
				&-center-center {
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
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
	}
</style>
