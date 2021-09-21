<Spectre>
	<Navbar>
		<nav slot="left">
			<div class="ml-2">
				<IconButton icon="back" />
			</div>
		</nav>

		<svelte:fragment slot="center">
			<img src="./b-science.svg" width="64px" height="64px" alt="Brand-Name" />
		</svelte:fragment>

		<nav slot="right">
			<div class="mr-2">
				<IconButton
					icon="people"
					on:click={(e) => notice.warning('Warning', 5000, 'Warning', true)}
				/>
			</div>
		</nav>
	</Navbar>

	<main class="text-center">
		<slot />
	</main>
	<Toasts />
</Spectre>

<script>
	import '../app.scss';
	import { Spectre } from '$lib';
	// import '../../package/spectre.css';
	// import '$lib/spectre.scss';
	import { Navbar } from '$lib/layouts/';
	import { IconButton } from '$lib/components/';
	import Toasts from '$lib/components/Toast/Notices.svelte';
	import { notice } from '$lib/components/Toast/notice';
</script>
