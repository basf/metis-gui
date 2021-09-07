<svelte:window on:click={click} />

<main>
    <Header />

    <Viewpoint {...page}>
        <svelte:fragment slot="loading">Loading...</svelte:fragment>
    </Viewpoint>
</main>

<script>
    import { pattern, click, redirect } from 'svelte-pathfinder';
    import Viewpoint from 'svelte-viewpoint';

    import Header from '@/views/Header.svelte';

    import user from '@/stores/user';

    import routes from '@/routes';

    $: page = routes.find((route) => $pattern(route.path)) || null;
    $: $user ? redirect('/') : redirect('/login');
</script>

<style lang="scss" global>
    @import 'spectre.css/src/normalize';
    @import 'spectre.css/src/base';
    @import 'spectre.css/src/typography';
    @import 'spectre.css/src/layout';
    @import 'spectre.css/src/toasts';
    @import 'spectre.css/src/animations';
    @import 'spectre.css/src/utilities';
</style>
