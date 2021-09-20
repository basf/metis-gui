<progress class="progress" {value} max="100" />

<script lang="ts">
	export let value = 0;
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/progress';
	}
</style>
