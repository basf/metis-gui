import { writable } from 'svelte/store';

const LS_KEY = 'current_user';

const user = writable(null, (set) => {
    set(JSON.parse(localStorage.getItem(LS_KEY) || null));
});

user.subscribe(($user) => localStorage.setItem(LS_KEY, JSON.stringify($user)));

export default user;
