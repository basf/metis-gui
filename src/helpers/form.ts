import type { ChangeEvent } from '@/types/event';

export function submitOnChange(e: ChangeEvent): void {
	e.target.form && e.target.form.dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
}
