import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

type AsyncFn<T> = (...args: any[]) => Promise<T>;

export function useAsync<T>(asyncFunction: AsyncFn<T>, immediate = false) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await asyncFunction(...args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error });
        throw error;
      }
    },
    [asyncFunction]
  );

  // Execute immediately if requested
  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return {
    ...state,
    execute,
  };
}
