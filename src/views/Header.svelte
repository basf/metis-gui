<header class="mb-2">
	<Container>
		<Navbar>
			<nav slot="left">
				{#if $user && $path.toString() === '/profile'}
					<IconButton icon="back" size="xl" on:click={() => back()} />
				{/if}
			</nav>

			<IconButton slot="center" size="xxl" iconSize="4x" color="dark" href="/"
				>{@html Xray}</IconButton
			>

			<nav slot="right">
				{#if $user}
					<IconButton icon="people" size="xl" href="/profile" />
				{/if}
			</nav>
		</Navbar>
	</Container>
</header>

<script lang="ts">
	import { back, path } from 'svelte-pathfinder';
	import { Container, IconButton, Navbar } from 'svelte-spectre';
	import user from '@/stores/user';
	import Xray from '@/assets/img/b-science.svg';
</script>
