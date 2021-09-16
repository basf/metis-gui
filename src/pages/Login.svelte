<Container>
	<div class="column col-4 col-mx-auto">
		{#if errmsg}
			<Toast type="error">
				{errmsg.error || 'Login/Password incorrect'}
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
	import { Container, Input, Button, Toast } from 'svelte-spectre';

	import user from '@/stores/user';

	import { login, me } from '@/services/api';

	let username = '';
	let password = '';
	let errmsg;

	async function submit() {
		try {
			await login(username, password);
			$user = await me();
		} catch (err) {
			errmsg = err;
		}
	}
</script>
