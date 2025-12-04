export const debounce = (func, wait) => {
    let timeoutId = null;
    return function executedFunction(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    };
};