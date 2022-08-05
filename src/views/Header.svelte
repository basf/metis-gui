<header class="mb-2">
	<Container>
		<Navbar>
			<nav slot="left">
				{#if $user && $path.toString() === '/profile'}
					<IconButton icon="back" size="xl" on:click={() => back()} />
				{/if}
			</nav>

			<IconButton id="xray" slot="center" size="xxl" iconSize="4x" href="/">
				{@html logo}
			</IconButton>

			<nav slot="right">
				{#if $user}
					<Button variant="link" size="xl" href="/profile">
						{$user.firstName}&nbsp;{$user.lastName}&nbsp;<Icon icon="people" />
					</Button>
				{/if}
				{#if mode === 'light' && $user}
					<IconButton icon="shutdown" on:click={doLogout} />
				{/if}
			</nav>
		</Navbar>
	</Container>
</header>

<script lang="ts" context="module">
	import { getContext } from 'svelte';
	import { back, path } from 'svelte-pathfinder';
	import { Button, Container, Icon, IconButton, Navbar, toast } from 'svelte-spectre';

	import logo from '@/assets/img/metis.svg';

	import user, { userAsync } from '@/stores/user';
	import { logout } from '@/services/api';
</script>

<script lang="ts">
	const mode = getContext('mode');

	async function doLogout() {
		await logout();
		$userAsync = null;
		toast.warning({ msg: 'You are logged out', timeout: 4000, pos: 'top_right' });
	}
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
