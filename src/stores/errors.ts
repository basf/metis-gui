import { writable } from 'svelte/store';

function createErrors() {
    const { subscribe, set, update } = writable<Error[]>([]);

    return {
        subscribe,
        append(err: Error, hideAfter = 0) {
            update(($errors) => {
                $errors.unshift(err);
                hideAfter &&
                    setTimeout(() => {
                        set($errors.filter((error) => error !== err));
                    }, hideAfter);

                return $errors;
            });
        },
        clear() {
            set([]);
        },
    };
}

export default createErrors();
