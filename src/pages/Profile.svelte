<Grid>
	<Col col="6 mx-auto">
		{#if $user}
			<Panel>
				<div slot="header" class="text-center">
					<figure class="avatar avatar-lg" data-initial="AE" />
					<div class="panel-title h5 mt-10">{$user.firstname} {$user.lastname}</div>
				</div>
				<nav slot="nav">
					<!-- TODO: split to separate component -->
					<ul class="tab tab-block">
						<li class="tab-item active">Profile</li>
					</ul>
					<!-- / TODO: split to separate component -->
				</nav>
				<div slot="body" class="my-2">
					<Tile>
						<b slot="title">E-mail: {$user.email}</b>
					</Tile>
					<Tile>
						<Switch bind:value={$darkTheme}>Dark theme</Switch>
					</Tile>
				</div>

				<svelte:fragment slot="footer">
					<Button on:click={doLogout} variant="primary" block>Logout</Button>
				</svelte:fragment>
			</Panel>
		{/if}
	</Col>
</Grid>

<script lang="ts">
	import { Button, Col, Grid, Panel, Switch, Tile } from 'svelte-spectre';

	import user, { userAsync } from '@/stores/user';
	import { darkTheme } from '@/stores/profile';

	import { nodeAttribute } from '@/helpers/dom';

	import { logout } from '@/services/api';

	async function doLogout() {
		await logout();
		$userAsync = null;
	}

	$: nodeAttribute(document.documentElement, 'color-scheme', $darkTheme ? 'dark' : 'light');
</script>

<style lang="scss">
	@import 'spectre.css/src/tabs';
</style>
