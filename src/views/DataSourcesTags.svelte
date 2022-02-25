<ul class="tags">
	<li><Badge>initial</Badge></li>
	<li><Badge color="primary">primary</Badge></li>
	<li><Badge color="secondary">secondary</Badge></li>
	<li><Badge color="success">success</Badge></li>
	<li><Badge color="warning">warning</Badge></li>
	<li><Badge color="error">error</Badge></li>
</ul>

<script lang="ts" context="module">
	import {
		Badge,
		Button,
		Col,
		Divider,
		Dropdown,
		Grid,
		Hero,
		Icon,
		IconButton,
		Input,
		Menu,
		Modal,
		Tile,
	} from 'svelte-spectre';
</script>

<script lang="ts"></script>

<style lang="scss">
	ul.tags {
		list-style: none;
		margin: 0;
		padding: 0;
		display: inline-flex;
		flex-flow: row wrap;
		gap: 0.25em;
		float: right;
		li {
			margin: 0;
			padding: 0;
		}
	}
</style>
