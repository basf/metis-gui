export function setItem<T>(key: string, value: T, storage: Storage = localStorage): void {
	const val = (typeof value === 'object' ? JSON.stringify(value) : '' + value) as string;
	return storage.setItem(key, val);
}
export function getItem<T>(key: string, storage: Storage = localStorage): T {
	let value: T | string | null = storage.getItem(key);

	if (value !== null) {
		try {
			value = JSON.parse(value);
			/* eslint no-empty: off */
		} catch (ignore) {}
	}

	return value as T;
}
