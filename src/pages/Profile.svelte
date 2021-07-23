<Container>
	<div class="columns">
		<div class="column col-4 col-mx-auto">
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
						<div class="tile tile-centered">
							<div class="tile-content">
								<div class="tile-title text-bold">E-mail</div>
								<div class="tile-subtitle">{$user.email}</div>
							</div>
						</div>
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
	import { onMount } from 'svelte';
	import { redirect, goto } from 'svelte-pathfinder';

	import Container from '@/layouts/Container.svelte';
	import Panel from '@/layouts/Panel.svelte';
	import Button from '@/components/Button';

	import user from '@/stores/user';
	import { logout } from '@/services/api';

	onMount(() => {
		!$user && redirect('/');
	});

	async function doLogout() {
		await logout();
		$user = null;
		goto('/');
	}
</script>

<style lang="scss">
	@import 'spectre.css/src/tabs';
</style>
