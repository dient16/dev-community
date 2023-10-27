export function hexToRgba(hex, alpha) {
    if (hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

export function saveToLocalStorage(key, data) {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

export function getFromLocalStorage(key) {
    try {
        const serializedData = localStorage.getItem(key);
        if (serializedData === null) {
            return { isLoggedIn: false, token: null, currentUser: null };
        }
        return JSON.parse(serializedData);
    } catch (error) {
        return { isLoggedIn: false, token: null, currentUser: null };
    }
}
