<svelte:window on:click={click} />

<Spectre>
	<Header />
	<main>
		{#await $userAsync then user}
			{#if user}
				<Viewpoint {...page}>
					<svelte:fragment slot="loading">Loading...</svelte:fragment>
				</Viewpoint>
			{:else}
				<Login />
			{/if}
		{:catch err}
			{#if err?.response?.status === 401}
				<Login />
			{/if}
		{/await}
	</main>
	<Footer />
	<Toaster />
</Spectre>

<script lang="ts">
	import { pattern, click } from 'svelte-pathfinder';
	import Viewpoint from 'svelte-viewpoint';
	import { Spectre, Toaster } from 'svelte-spectre';

	import Login from '@/pages/Login.svelte';

	import Header from '@/views/Header.svelte';
	import Footer from '@/views/Footer.svelte';

	import { userAsync } from '@/stores/user';

	import routes from '@/routes';

	$: page = routes.find((route) => $pattern(route.path)) || null;
</script>
