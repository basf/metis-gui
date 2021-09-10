<Navbar>
	<nav slot="left">
		{#if $path.length > 1 && $path.toString() !== '/login'}
			<div class="ml-2">
				<IconButton icon="icon-back" on:click={back} />
			</div>
		{/if}
	</nav>

	<svelte:fragment slot="center">
		<img src="./b-science.png" width="64px" height="64px" alt="Brand-Name" />
		<Button href="http://localhost:5050/" />
		<IconButton icon="icon-people" iconSize="1x" href="#_" />
		<Icon icon="icon-back" />
	</svelte:fragment>

	<nav slot="right">
		{#if $user}
			<div class="mr-2">
				<IconButton icon="icon-people" href="/profile" />
			</div>
		{/if}
	</nav>
</Navbar>

<script>
	import { back, path } from 'svelte-pathfinder';
	import { Navbar, Button, IconButton, Icon } from 'svelte-spectre';
	// import Navbar from '@/layouts/Navbar.svelte';
	// import { IconButton } from '@/components/Button';
	// import Icon from '@/components/Icon';
	import user from '@/stores/user';
</script>
