<!-- {#if Object.keys($notice).length} -->
<!-- <section class="notices container p-absolute"> -->
<Notice />
<!-- </section> -->

<!-- {/if} -->
<script lang="ts">
	import Notice from './Notice.svelte';
	import { notice } from './notice';
</script>

<style lang="scss">
	.notices {
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
</style>
