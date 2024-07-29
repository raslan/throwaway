import {
  Dialog,
  DialogBackdrop,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';
import { Email } from 'src/types';
import CloseIcon from './CloseIcon';

const EmailDialog = ({
  emailData,
  isOpen,
  setIsOpen,
}: {
  emailData: Email;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto'
        onClose={() => setIsOpen(false)}
      >
        <div className='min-h-screen text-center'>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <DialogBackdrop className='fixed inset-0 bg-app opacity-75' />
          </TransitionChild>

          <DialogTitle className='absolute left-1/4 right-1/4 top-3 p-4 text-white'>
            <button className='group' onClick={() => setIsOpen(false)}>
              <div className='text-xl font-bold flex gap-2 justify-center items-center motion-safe:group-hover:-translate-x-1 duration-300'>
                <CloseIcon />
                <span className='group-hover:underline'>Back</span>
              </div>
            </button>
          </DialogTitle>

          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-300'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='inline-block mx-0 my-8 mt-24 transition-all transform shadow-xl bg-white'>
              <div
                dangerouslySetInnerHTML={{
                  __html: emailData?.body_html
                    ? emailData?.body_html
                    : (emailData?.body_text as string),
                }}
              ></div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EmailDialog;
