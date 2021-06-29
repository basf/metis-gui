<Container>
	<div class="column col-4 col-mx-auto">
		{#if error}
			<Toast type="error">
				{error.message || 'Login/Password incorrect'}
			</Toast>
		{/if}
		<form on:submit|preventDefault={submit}>
			<Input bind:value={username} placeholder="Name" inline>Name</Input>
			<Input bind:value={password} placeholder="Password" type="password" inline
				>Password</Input
			>
			<Button variant="primary" type="submit" block>Login</Button>
		</form>
	</div>
</Container>

<script>
	import Container from '@/layouts/Container.svelte';
	import Input from '@/components/Input';
	import Button from '@/components/Button';
	import Toast from '@/components/Toast';

	import user from '@/stores/user';

	import { login } from '@/services/api';

	let username = '';
	let password = '';
	let error;

	async function submit() {
		try {
			$user = await login(username, password);
			//goto('/profile');
		} catch (err) {
			error = err;
		}
	}
</script>
