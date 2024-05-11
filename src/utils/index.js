var debounceTimer;
export const debounce = (callback, delay = 500) => {
  return (...args) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
