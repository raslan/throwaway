import { useCallback, useEffect, useReducer } from 'react';

interface State<T> {
  data?: T;
  error?: Error;
  refresh: () => void;
}

// discriminated union type
type Action<T> =
  | { type: 'loading' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error };

function useFetch<T = unknown>(url?: string, options?: RequestInit): State<T> {
  const initialState: State<T> = {
    error: undefined,
    data: undefined,
    refresh: () => {},
  };

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case 'loading':
        return { ...initialState };
      case 'fetched':
        return { ...initialState, data: action.payload };
      case 'error':
        return { ...initialState, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  const fetchData = useCallback(async () => {
    dispatch({ type: 'loading' });

    try {
      const response = await fetch(url as RequestInfo, options);
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = (await response.json()) as T;

      dispatch({ type: 'fetched', payload: data });
    } catch (error) {
      dispatch({ type: 'error', payload: error as Error });
    }
  }, [url, options]);

  useEffect(() => {
    // Do nothing if the url is not given
    if (!url) return;

    void fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { ...state, refresh: fetchData };
}

export default useFetch;
