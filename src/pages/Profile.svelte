<Container>
	<Grid>
		<Col col="6" offset="mx">
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
					<div slot="body">
						<Tile>
							<b slot="title">E-mail: {$user.email}</b>
						</Tile>
					</div>

					<svelte:fragment slot="footer">
						<Button on:click={doLogout} variant="primary" block>Logout</Button>
					</svelte:fragment>
				</Panel>
			{/if}
		</Col>
	</Grid>
</Container>

<script>
	import { Button, Col, Container, Grid, Panel, Tile } from 'svelte-spectre';

	import user from '@/stores/user';

	import { logout } from '@/services/api';

	async function doLogout() {
		await logout();
		$user = null;
	}
</script>

<style lang="scss">
	@import 'spectre.css/src/tabs';
</style>
