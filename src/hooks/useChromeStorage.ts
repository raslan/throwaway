import { useState, useEffect } from 'react';

function useChromeStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    chrome.storage.sync.get([key], (result) => {
      if (result[key] !== undefined) {
        setStoredValue(result[key] as T);
      }
    });
  }, [key]);

  const setValue = (value: T) => {
    setStoredValue(value);
    chrome.storage.sync.set({ [key]: value });
  };

  return [storedValue, setValue];
}

export default useChromeStorage;
