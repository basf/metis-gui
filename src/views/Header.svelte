<header class="mb-2">
	<Container>
		<Navbar>
			<nav slot="left">
				{#if $user && $path.toString() === '/profile'}
					<IconButton icon="back" size="xl" on:click={() => back()} />
				{/if}
			</nav>

			<IconButton id="xray" slot="center" size="xxl" iconSize="4x" href="/">
				{@html Xray}
			</IconButton>

			<nav slot="right">
				{#if $user}
					<Button variant="link" size="xl" href="/profile">
						{$user.firstName}&nbsp;{$user.lastName}&nbsp;<Icon icon="people" />
					</Button>
				{/if}
			</nav>
		</Navbar>
	</Container>
</header>

<script lang="ts">
	import { back, path, pattern, query } from 'svelte-pathfinder';
	import { Button, Container, Icon, IconButton, Navbar } from 'svelte-spectre';
	import user from '@/stores/user';
	import Xray from '@/assets/img/metis.svg';
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
