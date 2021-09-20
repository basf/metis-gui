<div class="column {classes} {offset && `col-${offset}-auto`} {$$props.class || ''}">
	<slot />
</div>

<script lang="ts" context="module">
	// import type { Size } from '../../types/size';

	// type Col = 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
	type Mq = 'col' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type Offset = '' | 'mx' | 'ml' | 'mr';
	export type { Mq, Offset };
</script>

<script lang="ts">
	// export let size: Col = 'auto';
	export let mq: Mq[] = ['col', 'xs', 'sm', 'md', 'lg', 'xl'];
	export let offset: Offset = '';

	$: classes =
		$$restProps &&
		Object.entries($$restProps)
			.map(([k, v]) => {
				if (mq.some((m) => m === k)) {
					const key = k !== 'col' ? `${k}-` : '';
					return `col-${key}${v}`;
				}
			})
			.filter(Boolean)
			.join(' ');
</script>

<style lang="scss">
	:global(.spectre) {
		@import 'spectre.css/src/layout';
	}
	[class~='col-'],
	.column {
		// flex: 1;
		// max-width: 100%;
		// padding-left: $layout-spacing;
		// padding-right: $layout-spacing;
		padding-bottom: $layout-spacing * 2;
	}
</style>
