{#if Object.keys($notice).length}
	{#each Object.entries($notice) as [k, v]}
		<!-- {#each k as pos} -->
		{#each v as toast, i (toast.id)}
			<div
				animate:flip
				style="--next-{toast.pos}: {nextPos(i, toast)}px; {toast.timeout
					? `--timeout: ${toast.timeout}ms`
					: ''}"
				class:timeout={timered.includes(toast.id)}
				class="toast {toast.type && `toast-${toast.type}`} m-2 pos-{toast.pos}"
				on:introstart={(e) => checkTimeout(toast)}
				in:fly={{ y: -48 }}
				out:fade
				bind:this={nodes[i]}
			>
				{#if toast.close}
					<IconButton
						size="md"
						icon="cross"
						on:click={(e) => notice.close(toast.id, toast.pos)}
					/>
				{/if}
				{#if toast.icon}
					<Grid align="center">
						<Col col="auto">
							<Icon icon={toast.icon} size={toast.title ? '2x' : '1x'} />
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
		<!-- {/each} -->
	{/each}
{/if}

<script lang="ts">
	import { onMount, afterUpdate, tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly, fade } from 'svelte/transition';

	import { Button, Icon, IconButton } from '../../components';
	import { Grid, Col } from '../../layouts';

	import { notice } from './notice';
	import { positions } from './positions';
	import type { Pos, Toast } from './notice';
	import Toast from './Toast.svelte';

	let timered: number[] = [],
		nodes: HTMLElement[] = [],
		spectre: HTMLElement;

	onMount(() => (spectre = document.querySelector('.spectre')));

	function checkTimeout(toast: Toast) {
		if (toast.timeout > 0) timered = [...timered, toast.id];
		// else timered = [];
	}

	function portalAction(node: Element, parent: Element): void {
		parent = parent || document.body;
		parent.appendChild(node);
	}

	function nextPos(i: number, toast: Toast) {
		// $notice = {...$notice, {toast.pos: [...toast]}}
		return (nodes[i] && i * (nodes[i].offsetHeight + 8)) || 0;
	}

	$: console.log($notice);
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/toasts';
		.toast {
			max-width: 300px;
			position: fixed;
			:global(.btn-link) {
				position: absolute;
				top: 0;
				right: 0;
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
			&.pos {
				&-top_center {
					top: var(--next-top_center);
					left: 50%;
					transform: translate(-50%, 0);
				}
				&-top_right {
					top: 0;
					right: 0;
				}
				&-center_right {
					top: 50%;
					right: 0;
					transform: translate(0, -50%);
				}
				&-bottom_right {
					bottom: var(--next-bottom_right);
					right: 0;
				}
				&-bottom_center {
					bottom: 0;
					left: 50%;
					transform: translate(-50%, 0);
				}
				&-bottom_left {
					bottom: 0;
					left: 0;
				}
				&-center_left {
					top: 50%;
					left: 0;
					transform: translate(0, -50%);
				}
				&-top_left {
					top: 0;
					left: 0;
				}
				&-center_center {
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
