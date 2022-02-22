<footer class="py-2 mt-2">
	<Container>
		<Navbar>
			<nav slot="left">
				This is the <a href="https://basf.science">BASF.science</a> &mdash; <br />an
				open-source XRPD online data management system.
			</nav>
			<nav slot="right"><Switch bind:value={$darkTheme}>Dark theme</Switch></nav>
		</Navbar>
	</Container>
</footer>

<script lang="ts">
	import { Container, Navbar, Switch } from 'svelte-spectre';

	import { nodeAttribute } from '@/helpers/dom';

	import { darkTheme } from '@/stores/theme';

	$: nodeAttribute(document.documentElement, 'color-scheme', $darkTheme ? 'dark' : 'light');
</script>

<style lang="scss">
	/* sticky footer --------------------------- */
	:global(body),
	:global(html) {
		height: 100%;

		/* Newest ------------------------------ */
		// footer {
		// 	position: sticky;
		// 	top: 100vh;
		// }

		/* modern ------------------------------ */
		:global(.spectre) {
			min-height: 100%;
			display: grid !important;
			grid-template-rows: auto 1fr auto;
		}

		/* legacy ------------------------------- */
		// display: flex;
		// flex-direction: column;
		// :global(header),
		// footer {
		// 	flex-shrink: 0;
		// }
		// :global(main) {
		// 	flex-grow: 1;
		// }
	}
	@media (prefers-color-scheme: dark) {
		footer {
			background-color: $dark-secondary;
		}
	}
	:global([color-scheme='dark']) {
		footer {
			background-color: $dark-secondary;
		}
	}
	:global([color-scheme='light']) {
		footer {
			background-color: $secondary-color;
		}
	}
</style>
