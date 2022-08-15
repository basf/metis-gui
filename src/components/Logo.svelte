<span {id} class="p-centered" style:--width={size}>
	<slot>
		{@html logo}
	</slot>
</span>

<script lang="ts">
	import logo from '@/assets/img/metis.svg';

	export let id = 'metis';
	export let size = '7em';
</script>

<style lang="scss">
	span {
		width: var(--width);
		height: 100%;
	}
	@media (prefers-color-scheme: dark) {
		:global(#metis) {
			color: $gray-color;
		}
	}
	@media (prefers-color-scheme: light) {
		:global(#metis) {
			color: $dark-color;
		}
	}
	:global([color-scheme='dark']) {
		:global(#metis) {
			color: $gray-color;
		}
	}
	:global([color-scheme='light']) {
		:global(#metis) {
			color: $dark-color;
		}
	}
</style>
