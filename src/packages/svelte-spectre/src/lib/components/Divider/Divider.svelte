<div
	class:divider={align === 'vertical'}
	class:text-center={align === 'horizontal'}
	class:divider-vert={align === 'vertical'}
	data-content={text || undefined}
/>

<script lang="ts" context="module">
	type Align = 'vertical' | 'horizontal';
	export type { Align };
</script>

<script lang="ts">
	export let align: Align = 'horizontal';
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
