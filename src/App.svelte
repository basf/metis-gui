<svelte:window on:click={click} />

<Spectre>
	<Header />
	<main>
		<Container>
			{#await $userAsync then user}
				{#if user}
					{#if user.email}
						<div class="mt-2 pt-2">
							<Viewpoint {...page}>
								<svelte:fragment slot="loading">Loading...</svelte:fragment>
							</Viewpoint>
						</div>
					{:else}
						<AskEmail />
					{/if}
				{:else}
					<Login />
				{/if}
			{:catch err}
				{#if err?.response?.status === 401}
					<Login />
				{/if}
			{/await}
		</Container>
	</main>
	<Footer />
	{#key $user?.id}
		<Msgbar />
	{/key}
	<Confirmator />
</Spectre>

<script lang="ts">
	import { setContext } from 'svelte';
	import { pattern, click } from 'svelte-pathfinder';
	import Viewpoint from 'svelte-viewpoint';
	import { Container, Spectre } from 'svelte-spectre';

	import Login from '@/pages/Login.svelte';
	import AskEmail from '@/pages/AskEmail.svelte';

	import Header from '@/views/Header.svelte';
	import Footer from '@/views/Footer.svelte';
	import Msgbar from '@/views/Msgbar.svelte';
	import Confirmator from '@/views/Confirmator.svelte';

	import { userAsync } from '@/stores/user';

	import type { Route } from '@/types/routes';
	import user from '@/stores/user';

	export let routes: Route[] = [];
	export let mode = '';

	setContext('routes', routes);
	setContext('mode', mode);

	$: page = routes.find((route: Route) => $pattern(route.path)) || null;
</script>
