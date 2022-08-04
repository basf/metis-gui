<div class="overlay">
	<slot>Sorry, we are currently offline</slot>
	<IconButton {icon} on:click={action} />
</div>

<script lang="ts" context="module">
	import { IconButton } from 'svelte-spectre';
</script>

<script>
	export let icon = 'refresh';
	export let action = () => location.reload();
</script>
