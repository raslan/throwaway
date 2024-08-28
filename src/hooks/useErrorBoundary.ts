import { useState, useEffect } from 'react';

function useErrorBoundary() {
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const handleError = (error: any) => {
      setError(error);
    };

    // Adding a global error listener
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  return { error, setError };
}

export default useErrorBoundary;
