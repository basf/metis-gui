<header class="mb-2">
	<Container>
		<Navbar>
			<nav slot="left">
				{#if $user && $pattern('/profile')}
					<IconButton icon="back" size="xl" on:click={back} />
				{/if}
			</nav>

			<svelte:fragment slot="center">
				{#if $user}
					<IconButton size="xxl" iconSize="4x" href="/">
						<Logo />
					</IconButton>
				{/if}
			</svelte:fragment>

			<nav slot="right">
				{#if $user}
					<Button variant="link" size="xl" href="/profile">
						{$user.firstName}&nbsp;{$user.lastName}&nbsp;<Icon icon="people" />
					</Button>
					{#if mode === 'light'}
						<IconButton icon="shutdown" on:click={doLogout} />
					{/if}
				{/if}
			</nav>
		</Navbar>
	</Container>
</header>

<script lang="ts" context="module">
	import { getContext } from 'svelte';
	import { back, pattern } from 'svelte-pathfinder';
	import { Button, Container, Icon, IconButton, Navbar, toast } from 'svelte-spectre';

	import Logo from '@/components/Logo.svelte';

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
