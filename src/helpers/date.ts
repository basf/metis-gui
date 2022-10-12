import type { Timestamps } from '@/types/dto';

export function showTimestamp({ updatedAt, createdAt }: Timestamps): string {
	return new Date(updatedAt || createdAt).toLocaleDateString('de-DE', { year: '2-digit', month: '2-digit', day: '2-digit' });
}
