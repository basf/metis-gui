<footer class="container text-center bg-gray d-flex py-2 mt-2">
	<copy class="py-2">
		© {new Date().getFullYear()} <a href="https://basf.science">basf.science</a>
	</copy>
</footer>

<script lang="ts">
</script>

<style lang="scss">
	footer {
		align-items: center;
		justify-content: center;
	}

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
