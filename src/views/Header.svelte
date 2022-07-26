<header class="my-2">
	<Container>
		<Navbar>
			<nav slot="left">
				{#if $user && $path.toString() === '/profile'}
					<IconButton icon="back" size="xl" on:click={() => back()} />
				{/if}
			</nav>

			<IconButton id="xray" slot="center" size="xxl" iconSize="4x" href="/"
				>{@html axlogo}</IconButton
			>

			<nav slot="right">
				{#if $user}
					<Button variant="link" size="xl" href="https://mpds.io/#modal/menu">
						{$user.firstName}&nbsp;{$user.lastName}&nbsp;<Icon icon="people" />
					</Button>
				{/if}
			</nav>
		</Navbar>
	</Container>
</header>

<script lang="ts">
	import { back, path } from 'svelte-pathfinder';
	import { Button, Container, Icon, IconButton, Navbar } from 'svelte-spectre';
	import user from '@/stores/user';
	import axlogo from '@/assets/img/absolidix.svg';
</script>

<style lang="scss">
	@media (prefers-color-scheme: dark) {
		:global(#xray) {
			color: $gray-color;
		}
	}
	@media (prefers-color-scheme: light) {
		:global(#xray) {
			color: $dark-color;
		}
	}
	:global([color-scheme='dark']) {
		:global(#xray) {
			color: $gray-color;
		}
	}
	:global([color-scheme='light']) {
		:global(#xray) {
			color: $dark-color;
		}
	}
</style>
