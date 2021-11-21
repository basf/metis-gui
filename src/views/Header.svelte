<header class="mb-2">
	<Navbar classes={'container grid-md'}>
		<nav slot="left">
			{#if $user && $path.toString() === '/profile'}
				<IconButton icon="back" iconSize="1x" size="xl" on:click={() => back()} />
			{/if}
		</nav>

		<IconButton slot="center" size="xxl" iconSize="4x" color="dark" href="/"
			>{@html Xray}</IconButton
		>

		<nav slot="right">
			{#if $user}
				<IconButton class="mr-2" icon="people" iconSize="1x" size="xl" href="/profile" />
			{/if}
		</nav>
	</Navbar>
</header>

<script lang="ts">
	import { back, path } from 'svelte-pathfinder';
	import { Navbar, IconButton } from 'svelte-spectre';
	import user from '@/stores/user';
	import Xray from '@/assets/img/b-science.svg';
</script>
