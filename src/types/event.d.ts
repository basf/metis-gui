export interface ChangeEvent extends Event {
    target: EventTarget &
        (HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement);
}
