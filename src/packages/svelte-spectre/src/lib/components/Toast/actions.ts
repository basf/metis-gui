export function pausable(node: HTMLElement, paused: boolean, pause: Function, resume: Function) {
    return {
        update(paused: boolean) {
            node.onmouseenter = pause;
            node.onmouseleave = resume;
        },
        destroy() {
            node.onmouseenter = null;
            node.onmouseleave = null;
        },
    };
}
