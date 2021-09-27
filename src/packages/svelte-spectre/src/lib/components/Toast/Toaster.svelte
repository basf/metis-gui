{#if $toast.length}
	<section class="toaster">
		{#each positions as pos}
			<ul class="toast-list pos-{pos}">
				{#each toasted(pos) as tost, i (tost.id)}
					<li in:fly={flying(tost)} out:fade animate:flip={{ duration: 500 }}>
						<Toast
							{tost}
							invert
							bind:progress
							on:mount={(e) => mount(tost)}
							on:hover={(e) => pause(tost)}
							on:leave={(e) => resume(tost)}
							on:destroy={(e) => destroy(tost)}
							on:close={(e) => close(tost)}
						>
							{#if tost.title}<h5>{tost.title}</h5>{/if}
							<p>{tost.msg}</p>
						</Toast>
					</li>
				{/each}
			</ul>
		{/each}
	</section>
{/if}

<script lang="ts" context="module">
	import { flip } from 'svelte/animate';
	import { fly, fade } from 'svelte/transition';

	import { positions } from './positions';
	import { toast } from './toast';
	import Toast from './';

	import type { Tweened } from 'svelte/motion';
	import type { Tost } from './toast';
</script>

<script lang="ts">
	let progress: Tweened<number>;

	$: console.log(progress);

	function flying(t: Tost) {
		return t.pos.includes('top') ? { y: -48 } : { y: 48 };
	}

	function mount(t: Tost) {
		// progress.set(t.progress, { duration: t.timeout });
	}
	function pause(t: Tost) {
		toast.pause();
		// progress.set($progress, { duration: 0 });
	}
	function resume(t: Tost) {
		toast.resume();
		// progress.set(t.progress, { duration: t.timeout });
	}
	function destroy(t: Tost) {
		// progress.set(1, { duration: 0 });
	}
	function close(t: Tost) {
		// progress.set(0, { duration: 0 });
		toast.close(t.id);
	}
	$: toasted = (pos: string) => $toast.filter((t) => t.pos === pos);
</script>

<style lang="scss">
	.toaster {
		.toast-list {
			position: fixed;
			width: 300px;
			list-style: none;
			margin: 0;
			& > li {
				margin: $layout-spacing;
			}
			&.pos {
				&-top_center {
					top: 0;
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
					bottom: 0;
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
		}
	}
</style>
