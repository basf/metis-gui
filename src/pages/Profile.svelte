<Container>
	<div class="columns">
		<div class="column col-6 col-mx-auto">
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
		</div>
	</div>
</Container>

<script>
	import Container from '@/layouts/Container.svelte';
	import Panel from '@/layouts/Panel.svelte';
	import Tile from '@/layouts/Tile.svelte';
	import Button from '@/components/Button';

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
