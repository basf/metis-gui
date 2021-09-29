export async function online(url: string) {
    if (navigator.onLine)
        try {
            const r = await fetch(url, { mode: 'no-cors' });
            return true;
        } catch (e) {
            return false;
        }
}

// use example
// (async () => {
//     console.log('online', await online('https://basf.science'))
// })()
