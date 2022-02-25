import type { Timestamps } from '@/types/dto';

export function showTimestamp({ updated_at, created_at }: Timestamps): string {
    return new Date(updated_at || created_at).toLocaleString();
}
