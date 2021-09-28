{#if $toast.length}
	<section class="toaster">
		{#each positions as pos}
			<ul class="toast-list pos-{pos}">
				{#each toasted(pos) as tost, i (tost.id)}
					<li in:fly={flying(tost)} out:fade animate:flip={{ duration: 500 }}>
						<Toast {tost} invert>
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
	import { toast } from './';
	import Toast from './';

	import type { Tost } from './';
</script>

<script lang="ts">
	const flying = (t: Tost) => (t.pos.includes('top') ? { y: -48 } : { y: 48 });
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
