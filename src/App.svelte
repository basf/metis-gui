<svelte:window on:click={click} />

<Spectre>
	<Header />
	<main>
		<Container>
			{#await $userAsync then user}
				{#if user}
					<div class="mt-2 pt-2">
						<Viewpoint {...page}>
							<svelte:fragment slot="loading">Loading...</svelte:fragment>
						</Viewpoint>
					</div>
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
	<Msgbar />
	<Confirmator />
</Spectre>

<script lang="ts">
	import { pattern, click } from 'svelte-pathfinder';
	import Viewpoint from 'svelte-viewpoint';
	import { Container, Spectre } from 'svelte-spectre';

	import Login from '@/pages/Login.svelte';

	import Header from '@/views/Header.svelte';
	import Footer from '@/views/Footer.svelte';
	import Msgbar from '@/views/Msgbar.svelte';
	import Confirmator from '@/views/Confirmator.svelte';

	import { userAsync } from '@/stores/user';

	import routes from '@/routes';

	$: page = routes.find((route) => $pattern(route.path)) || null;
</script>
