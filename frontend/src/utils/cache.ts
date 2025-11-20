export const setCache = (key: string, value: any, ttlMinutes = 60) => {
    const expires = Date.now() + ttlMinutes * 60 * 1000;
    const data = { value, expires };
    localStorage.setItem(key, JSON.stringify(data));
};

export const getCache = (key: string) => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        const { value, expires } = JSON.parse(raw);
        if (Date.now() > expires) {
            localStorage.removeItem(key); // expired → remove
            return null;
        }
        return value;
    } catch {
        localStorage.removeItem(key);
        return null;
    }
};

export const clearCache = (prefix: string) => {
    // Remove all keys starting with prefix
    Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(prefix)) localStorage.removeItem(k);
    });
};
