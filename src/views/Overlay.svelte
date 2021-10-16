{#if !$status.online || !$status.heartbeat}
	<div class="overlay">
		<slot>BFF is unreachable</slot>
		<IconButton icon="refresh" on:click={() => location.reload()} />
	</div>
{/if}

<script lang="ts">
	import { IconButton } from 'svelte-spectre';
	import status from '@/stores/status';
</script>

<style lang="scss">
	.overlay {
		position: absolute;
		inset: 0;
		cursor: default;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
		background: rgba($bg-color, 0.75);
		color: $error-color;
	}
</style>
