{#if $user}
	<Panel>
		<div slot="header" class="text-center">
			<Avatar size="xl" bg="#eee" name={$user.firstName + ' ' + $user.lastName} caption />
		</div>
		<Tabs slot="nav" items={profile} bind:active block />
		<div slot="body" class="mt-2">
			<Tile>
				<span slot="title">E-mail: <a href="mailto:{$user.email}">{$user.email}</a></span>
			</Tile>
		</div>

		<svelte:fragment slot="footer">
			<Button on:click={doLogout} variant="primary" block>Log out</Button>
		</svelte:fragment>
	</Panel>
{/if}

<script lang="ts" context="module">
	import { Avatar, Button, Panel, Tabs, Tile, toast } from 'svelte-spectre';

	import user, { userAsync } from '@/stores/user';
	import { withConfirm } from '@/stores/confirmator';

	import { logout } from '@/services/api';
</script>

<script lang="ts">
	let profile = [{ title: 'Profile' }],
		active = 1;

	async function doLogout() {
		await logout();
		$userAsync = null;
		toast.warning({ msg: 'You are logged out', timeout: 4000, pos: 'top_right' });
	}
</script>

<style>
	.text-center :global(figcaption) {
		width: max-content;
	}
</style>
