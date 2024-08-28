import React, { useEffect } from 'react';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import { useExtensionManagement } from '@/hooks/useExtensionManagement';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Toaster } from './ui/sonner';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const { error } = useErrorBoundary();
  const { resetExtension } = useExtensionManagement();

  useEffect(() => {
    if (error?.message) {
      toast.error(
        'Throwaway detected an error, automatically resetting extension...'
      );
      setTimeout(() => {
        resetExtension();
      }, 3000);
    }
  }, [error]);

  if (error) {
    return (
      <>
        <div className='bg-background w-[800px] h-[600px] text-foreground flex flex-col text-lg items-center justify-center gap-3'>
          <p>{error.message}</p>
          <Button onClick={resetExtension}>Reset Extension</Button>
          <Toaster position='top-right' />
        </div>
      </>
    );
  }

  return children;
};

export default ErrorBoundary;
