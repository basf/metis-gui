<Navbar classes={'container grid-md red'}>
	<nav slot="left">
		{#if $path.length > 1 && $path.toString() !== '/login'}
			<IconButton icon="back" iconSize="1x" size="xl" on:click={back} />
		{/if}
	</nav>

	<svelte:fragment slot="center">
		<IconButton size="xxl" iconSize="4x" color="dark" href="/">{@html Xray}</IconButton>
	</svelte:fragment>

	<nav slot="right">
		{#if $user}
			<IconButton class="mr-2" icon="people" iconSize="1x" size="xl" href="/profile" />
		{/if}
	</nav>
</Navbar>

<script>
	import { back, path } from 'svelte-pathfinder';
	import { Container, Navbar, IconButton } from 'svelte-spectre';
	import user from '@/stores/user';
	import Xray from '@/assets/img/b-science.svg';
</script>

<style lang="scss">
	.red {
		color: red !important;
	}
</style>
