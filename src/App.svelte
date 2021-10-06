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

<script lang="ts">
	import { pattern, click, redirect } from 'svelte-pathfinder';
	import Viewpoint from 'svelte-viewpoint';
	import { Spectre, Toaster, toast } from 'svelte-spectre';

	import Header from '@/views/Header.svelte';
	import Footer from '@/views/Footer.svelte';

	import user from '@/stores/user';

	import routes from '@/routes';

	let on: boolean;

	$: page = routes.find((route) => $pattern(route.path)) || null;
	$: $user ? redirect('/') : redirect('/login');
</script>
