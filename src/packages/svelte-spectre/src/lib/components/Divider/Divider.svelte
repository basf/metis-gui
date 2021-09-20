<div
	class:divider={!vertical}
	class:text-center={!vertical}
	class:divider-vert={vertical}
	data-content={text || undefined}
/>

<script lang="ts">
	export let vertical: boolean = false;
	export let text: string = '';
</script>

<style lang="scss">
	@import 'spectre.css/src/utilities/divider';
	:global(.spectre) {
		.divider {
			&[data-content]::after {
				transform: translateY(-50%) !important;
			}
		}
		.divider-vert {
			&[data-content]::after {
				transform: translate(-50%, -50%) !important;
			}
		}
	}
</style>
