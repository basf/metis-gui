import { GUI_HOST, DOWNLOADABLE_APP_FILENAME, IS_FILE } from '@/config';

export function updateAppVersion(): void {
    if (IS_FILE) {
        downloadFile(GUI_HOST, DOWNLOADABLE_APP_FILENAME);
    } else {
        location.reload();
    }
}

export async function downloadFile(url: string, filename?: string): Promise<void> {
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
    
        a.style.display = 'none';
        a.href = href;
        filename && (a.download = filename);
    
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(href);
        document.body.removeChild(a);
    } catch(err) {
        console.error('Download failed', err);
    }
  }
