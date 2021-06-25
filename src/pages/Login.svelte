<Container>
    <div class="column col-4 col-mx-auto">
        <form on:submit|preventDefault={submit}>
            <Input bind:value={username} placeholder="Name" inline>Name</Input>
            <Input bind:value={password} placeholder="Password" type="password" inline>Password</Input>
            <Button variant="primary" type="submit" block>Login</Button>
        </form>
    </div>
</Container>

<script>
    import { goto } from 'svelte-pathfinder';
    import Container from '@/layouts/Container.svelte';
    import Input from '@/components/Input';
    import Button from '@/components/Button';

    import user from '@/stores/user';

    import { login } from '@/services/api';

    let username = '';
    let password = '';

    async function submit() {
        $user = await login(username, password);
        goto('/profile');
    }
</script>
