<svelte:window on:click={click} />

<main>
	<Header />
	<input value={$counter} on:change={e => setCounter(e.target.valueAsNumber)} type="number">

	<Viewpoint {...page}>
		<svelte:fragment slot="loading">Loading...</svelte:fragment>
	</Viewpoint>
</main>

<script>
	import { pattern, click, redirect } from 'svelte-pathfinder';
	import Viewpoint from 'svelte-viewpoint';

	import Header from '@/views/Header.svelte';

	import user from '@/stores/user';
	import counter from '@/stores/counter';

	import { getCounter, setCounter } from '@/services/api';

	import routes from '@/routes';

	getCounter();

	$: page = routes.find((route) => $pattern(route.path)) || null;
	$: if ($user) {
		redirect('/profile');
	}
</script>

<style lang="scss" global>
	@import 'spectre.css/src/normalize';
	@import 'spectre.css/src/base';
	@import 'spectre.css/src/typography';
	@import 'spectre.css/src/layout';
	@import 'spectre.css/src/toasts';
	@import 'spectre.css/src/animations';
	@import 'spectre.css/src/utilities';
</style>
