<Grid>
	<Col col="6 mx-auto">
		{#if $user}
			<Panel>
				<div slot="header" class="text-center">
					<figure class="avatar avatar-lg" data-initial="AE" />
					<div class="panel-title h5 mt-10">{$user.firstname} {$user.lastname}</div>
				</div>
				<nav slot="nav">
					<Tabs items={profile} bind:active block />
				</nav>
				<div slot="body" class="mt-2">
					<Tile>
						<span slot="title"
							>E-mail: <a href="mailto:{$user.email}">{$user.email}</a></span
						>
					</Tile>
				</div>

				<svelte:fragment slot="footer">
					<Button on:click={doLogout} variant="primary" block>Logout</Button>
				</svelte:fragment>
			</Panel>
		{/if}
	</Col>
</Grid>

<script lang="ts" context="module">
	import { Button, Col, Grid, Panel, Tabs, Tile } from 'svelte-spectre';

	import user, { userAsync } from '@/stores/user';

	import { logout } from '@/services/api';
</script>

<script lang="ts">
	let profile = [{ title: 'Profile' }],
		active = 1;

	async function doLogout() {
		await logout();
		$userAsync = null;
	}
</script>
