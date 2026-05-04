import React, { useEffect } from 'react';
import useErrorBoundary from '@/hooks/useErrorBoundary';
import { useExtensionManagement } from '@/hooks/useExtensionManagement';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Toaster } from './ui/sonner';
import { APP_NAME } from '@/config/brand';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const { error } = useErrorBoundary();
  const { resetExtension } = useExtensionManagement();

  useEffect(() => {
    if (error?.message) {
      toast.error(
        `${APP_NAME} detected an error, automatically resetting extension...`
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
          <p>
            {APP_NAME} detected an issue: {String(error?.message || 'unknown error')}
          </p>
          <Button onClick={resetExtension}>Reset {APP_NAME}</Button>
          <Toaster position='top-right' />
        </div>
      </>
    );
  }

  return children;
};

export default ErrorBoundary;
