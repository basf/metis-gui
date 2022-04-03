import type { Timestamps } from '@/types/dto';

export function showTimestamp({ updatedAt, createdAt }: Timestamps): string {
    return new Date(updatedAt || createdAt).toLocaleString();
}
