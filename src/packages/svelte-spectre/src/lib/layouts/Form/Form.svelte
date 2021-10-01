<form {...$$restProps} class:form-horizontal={horizontal} on:submit|preventDefault>
	<slot />
</form>

<script lang="ts">
	export let horizontal: boolean = true;
</script>

<style lang="scss">
	@import 'spectre.css/src/forms';
</style>
