<svelte:window on:click={click} />

<Spectre>
	<Header />
	<main>
		<Viewpoint {...page}>
			<svelte:fragment slot="loading">Loading...</svelte:fragment>
		</Viewpoint>
	</main>
	<Toaster />
</Spectre>

<script>
	import { pattern, click, redirect } from 'svelte-pathfinder';
	import Viewpoint from 'svelte-viewpoint';
	import { Spectre, Toaster } from 'svelte-spectre';

	import Header from '@/views/Header.svelte';

	import user from '@/stores/user';

	import routes from '@/routes';

	$: page = routes.find((route) => $pattern(route.path)) || null;
	$: $user ? redirect('/') : redirect('/login');
</script>
