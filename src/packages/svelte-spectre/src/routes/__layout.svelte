<Navbar>
	<nav slot="left">
		<div class="ml-2">
			<IconButton icon="icon-back" />
		</div>
	</nav>

	<svelte:fragment slot="center">
		<img src="./b-science.svg" width="64px" height="64px" alt="Brand-Name" />
	</svelte:fragment>

	<nav slot="right">
		<div class="mr-2">
			<IconButton icon="icon-people" />
		</div>
	</nav>
</Navbar>

<main class="text-center">
	<slot />
</main>

<script>
	import '../app.scss';
	import { Navbar, IconButton } from '$lib/index';
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
