<footer class="py-2 mt-2">
	<Container>
		<Navbar>
			<copy slot="center">
				This is the <a href="https://basf.science">BASF.science</a>, an open-source XRPD
				online data management system.
			</copy>
		</Navbar>
	</Container>
</footer>

<script lang="ts">
	import { Container, Navbar } from 'svelte-spectre';
	import { media } from '@/helpers/media';
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
