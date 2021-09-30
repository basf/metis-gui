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
	<Pinger bind:on url={'http://localhost:3000'} />
</Spectre>

<script>
	import { pattern, click, redirect } from 'svelte-pathfinder';
	import Viewpoint from 'svelte-viewpoint';
	import { Spectre, Pinger, Toaster, toast } from 'svelte-spectre';

	import Header from '@/views/Header.svelte';
	import Footer from '@/views/Footer.svelte';

	import user from '@/stores/user';

	import routes from '@/routes';

	let on: boolean;

	$: page = routes.find((route) => $pattern(route.path)) || null;
	$: $user ? redirect('/') : redirect('/login');

	$: {
		if (on) {
			toast.success({ msg: 'BFF is ON 👍🏻', timeout: 5000 });
			toast.close(0);
		} else if (on === undefined) {
			toast.warning({ msg: 'Await BFF response', timeout: 5000 });
		} else if (on === false) {
			toast.error({ msg: 'BFF is OFF 👎🏻', timeout: 5000 });
		}
	}
</script>
