import SubLabel from '@/components/advanced/SubLabel';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useExtensionManagement } from '@/hooks/useExtensionManagement';

const ResetExtensionData = () => {
  const { resetExtension } = useExtensionManagement();
  return (
    <div className='flex justify-between items-center'>
      <div className='flex flex-col gap-1'>
        <Label className='text-lg'>Reset All Extension Data</Label>
        <SubLabel>
          Clear all Throwaway data and start fresh. (Useful if the extension
          misbehaves)
        </SubLabel>
      </div>
      <Button variant='secondary' onClick={resetExtension}>
        Start Over
      </Button>
    </div>
  );
};

export default ResetExtensionData;
