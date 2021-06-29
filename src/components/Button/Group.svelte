<div class:btn-group-block={block} class="btn-group">
	<slot />
</div>

<script>
	export let block = false;
</script>

<style lang="scss">
	@import 'spectre.css/src/buttons';
</style>
