<Navbar>
	<nav slot="left">
		{#if $path.length > 1 && $path.toString() !== '/login'}
		<div class="ml-2">
			<IconButton icon="icon-back" on:click={back}></IconButton>
		</div>
		{/if}
	</nav>	

	<svelte:fragment slot="center">
		<img src="./b-science.png" width="64px" height="64px" alt="Brand-Name" />
	</svelte:fragment>

	<nav slot="right">
		{#if $user}
		<div class="mr-2">
			<IconButton icon="icon-people" href="/profile"></IconButton>
		</div>
		{/if}
	</nav>	
</Navbar>

<script>
	import { back, path } from 'svelte-pathfinder';
	import { IconButton } from '@/components/Button';
	import Navbar from '@/layouts/Navbar.svelte';
	import user from '@/stores/user';

</script>
