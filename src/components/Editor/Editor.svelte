<Code action={editor} {options} on:change />

<script context="module" lang="ts">
	import { Code } from 'svelte-spectre';
	import editor from './editor';
</script>

<script lang="ts">
	export let code = '';
	export let schema = {};

	let options = {
		code,
		schema,
		loc: true,
	};
</script>

<style lang="scss" global>
	pre::selection,
	code::selection,
	code *::selection {
		text-shadow: none;
		background: #ffe9b3;
	}
	.codejar-linenumbers {
		position: absolute !important;
		padding: 1rem !important;
		background-color: transparent !important;
		mix-blend-mode: normal !important;
		font-size: 0.85em !important;
		font-family: inherit !important;
		line-height: 1.5 !important;
		opacity: 0.3;
		color: #bcc3ce !important;
		z-index: 1;
		width: auto !important;
	}
	@media (prefers-color-scheme: dark) {
		pre::selection,
		code::selection,
		code *::selection {
			background: rgba(179, 127, 0, 0.2) !important;
		}
		mark {
			background: rgba(179, 127, 0, 0.2) !important;
			color: #bcc3ce !important;
		}
	}
	[color-scheme='dark'] {
		pre::selection,
		code::selection,
		code *::selection {
			background: rgba(179, 127, 0, 0.2) !important;
		}
		mark {
			background: rgba(179, 127, 0, 0.2) !important;
			color: #bcc3ce !important;
		}
	}
	[color-scheme='light'] {
		pre::selection,
		code::selection,
		code *::selection {
			background: #ffe9b3;
		}
		mark {
			background: #ffe9b3;
			color: #bcc3ce !important;
		}
	}
</style>
