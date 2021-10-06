<svelte:window on:click={click} />

<Spectre>
	<Header />
	<main>
		<Viewpoint {...page}>
			<svelte:fragment slot="loading">Loading...</svelte:fragment>
		</Viewpoint>
	</main>
	<Footer />
	<Toaster />
</Spectre>

<script>
	import { pattern, click, redirect, state, url } from 'svelte-pathfinder';
	import Viewpoint from 'svelte-viewpoint';
	import { Spectre, Toaster } from 'svelte-spectre';

	import Header from '@/views/Header.svelte';
	import Footer from '@/views/Footer.svelte';

	import user from '@/stores/user';

	import routes from '@/routes';

	$: page = routes.find((route) => $pattern(route.path)) || null;
	$: $user ? gotoInitialPage() : gotoLoginPage();

	function gotoInitialPage() {
		redirect($state.redirectURL || '/');
	}

	function gotoLoginPage() {
		redirect('/login', { redirectURL: $url });
	}
</script>
