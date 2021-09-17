<Navbar>
	<nav slot="left">
		{#if $path.length > 1 && $path.toString() !== '/login'}
			<div class="ml-2">
				<IconButton icon="icon-back icon-2x text-dark" on:click={back} />
			</div>
		{/if}
	</nav>

	<svelte:fragment slot="center">
		<img src="./b-science.png" width="64px" height="64px" alt="Brand-Name" />
	</svelte:fragment>

	<nav slot="right">
		{#if $user}
			<div class="mr-2">
				<IconButton icon="icon-people icon-2x text-dark" href="/profile" />
			</div>
		{/if}
	</nav>
</Navbar>

<script>
	import { back, path } from 'svelte-pathfinder';
	import { Navbar, IconButton } from 'svelte-spectre';
	import user from '@/stores/user';
</script>
