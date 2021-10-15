import { statusable } from 'svelte-statusable';

import { API_BASEURL, STREAM_URL } from '@/config';

export default statusable({
    ping: API_BASEURL,
    sse: STREAM_URL,
});