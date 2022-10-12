<div class="overlay">
	<slot>Connecting to server...</slot><!-- FIXME (1) not GUI offline, but BFF offline (2) splash screen -->
	<IconButton {icon} on:click={action} />
</div>

<script lang="ts" context="module">
	import { IconButton } from 'svelte-spectre';
</script>

<script>
	export let icon = 'refresh';
	export let action = () => location.reload();
</script>
