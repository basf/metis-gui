<footer class="bg-gray py-2 mt-2">
	<Navbar classes={'container grid-md'}>
		<copy slot="center">
			© {new Date().getFullYear()} <a href="https://basf.science">basf.science</a>
		</copy>
	</Navbar>
</footer>

<script lang="ts">
	import { Navbar } from 'svelte-spectre';
</script>

<style lang="scss">
	/* sticky footer --------------------------- */
	:global(body),
	:global(html) {
		height: 100%;

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
</style>
