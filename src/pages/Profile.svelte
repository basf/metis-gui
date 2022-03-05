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

<script lang="ts">
	import { Button, Col, Grid, Panel, Tile, toast } from 'svelte-spectre';

	import user, { userAsync } from '@/stores/user';

	import { logout } from '@/services/api';

	async function doLogout() {
		await logout();
		$userAsync = null;
		toast.warning({ msg: 'You are logged out', timeout: 4000, pos: 'top_right' });
	}
</script>

<style lang="scss">
	@import 'spectre.css/src/tabs';
</style>
