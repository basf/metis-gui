{#if $user}
	<Panel>
		<div slot="header" class="text-center">
			<Avatar size="xl" bg="#eee" name={$user.firstName + ' ' + $user.lastName} caption />
		</div>
		<Tabs slot="nav" items={profile} bind:active block />
		<div slot="body" class="mt-2">
			<div class="mt-2">
				<span>E-mail:</span> <a href="mailto:{$user.email}">{$user.email}</a>
			</div>

			<div class="mt-2">
				<span>API key:</span>
				{#if $loadingAPIKey}
					loading...
				{:else if $errorAPIKey}
					sorry, cannot retrieve...
				{:else}
					<span>{$apikey || 'not set'}</span>&nbsp;
				{/if}

				{#if $apikey}
				<IconButton on:click={() => controlAPIKey('remove')} variant="primary" icon="delete" shape="circle" size="sm" />
				{:else}
				<IconButton on:click={() => controlAPIKey('set')} variant="primary" icon="plus" shape="circle" size="sm" />
				{/if}
			</div>
		</div>

		<svelte:fragment slot="footer">
			<Button on:click={() => goto('/tags')} variant="default" block>Edit tags</Button>

			<div class="mt-2"></div>

			<Button on:click={doLogout} variant="primary" block>Log out</Button>
		</svelte:fragment>
	</Panel>
{/if}

<script lang="ts" context="module">
	import { Avatar, Button, IconButton, Panel, Tabs, Tile, toast } from 'svelte-spectre';
	import { goto } from 'svelte-pathfinder';

	import user, { userAsync } from '@/stores/user';
	import apikeyStore from '@/stores/apikey';
	import { withConfirm } from '@/stores/confirmator';

	//import { showTimestamp } from '@/helpers/date';

	import { logout } from '@/services/api';
</script>

<script lang="ts">
	const [apikey, loadingAPIKey, errorAPIKey, controlAPIKey] = apikeyStore();

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
