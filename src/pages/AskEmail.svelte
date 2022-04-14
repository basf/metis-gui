<Grid>
	<Col col="auto mx-auto">
		<Form on:submit={submit} horizontal>
			<p>Please provide your exising email address to continue a work with an application.</p>
			<FormGroup>
				<Input bind:value={email} expand="xs" placeholder="Email" width="8">Email</Input>
			</FormGroup>
			<Button variant="primary" type="submit" block>Save</Button>
		</Form>
	</Col>
</Grid>

<script lang="ts">
	import { Button, Col, Form, FormGroup, Grid, Input, toast } from 'svelte-spectre';

	import { userAsync } from '@/stores/user';

	let email = '';
	let errmsg;

	async function submit() {
		try {
			userAsync.update(($user) => {
				$user.email = email;
				return $user;
			});
			toast.success({
				msg: 'Thanks! Verification link is sent to your email',
				timeout: 4000,
				pos: 'top_right',
			});
		} catch (err) {
			errmsg = err;
			toast.error({
				msg: errmsg.error || 'Email saving failed',
				timeout: 4000,
				pos: 'top_right',
			});
		}
	}
</script>
