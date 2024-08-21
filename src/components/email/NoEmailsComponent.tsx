import SpinnerIcon from '@/components/SpinnerIcon';

const NoEmailsComponent = () => {
  return (
    <div className='flex flex-col w-full h-full items-center justify-center gap-4'>
      <h1 className='text-3xl text-primary mb-3 font-semibold'>Inbox Empty</h1>
      <div className='flex items-center gap-3'>
        <p className='text-primary/80'>Refreshes every 3 seconds</p>
      </div>
    </div>
  );
};

export default NoEmailsComponent;
