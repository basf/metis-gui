<Spectre>
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
</Spectre>

<script>
	import '../app.scss';
	import { Spectre } from '$lib';
	// import '../../package/spectre.css';
	// import '$lib/spectre.scss';
	import { Navbar } from '$lib/layouts';
	import { IconButton } from '$lib/components';
</script>
