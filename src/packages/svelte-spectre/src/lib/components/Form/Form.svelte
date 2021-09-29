<form class:form-horizontal={horizontal} on:submit|preventDefault>
	<slot />
</form>

<script context="module" lang="ts">
</script>

<script lang="ts">
	export let horizontal: boolean = true;
</script>

<style lang="scss">
	@import 'spectre.css/src/forms';

	:global(.spectre) {
		// Form horizontal
		.form-horizontal {
			padding: $layout-spacing 0;

			:global(.form-group) {
				display: flex;
				flex-wrap: wrap;
			}
		}
	}
</style>
