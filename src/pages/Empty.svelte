<Main>
	<Empty icon="mail" buttonVariant="primary" buttonText="button">
		<svelte:fragment slot="title">Subtitle</svelte:fragment>
		<svelte:fragment slot="subtitle">Title</svelte:fragment>
	</Empty>
</Main>

<script lang="ts">
	import { Empty } from 'svelte-spectre';

	import Main from '@/layouts/Main';
</script>
