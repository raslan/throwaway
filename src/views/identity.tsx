import { Fragment, ReactElement } from 'react';
import ReactCreditCard from 'react-credit-cards';
import { toast } from 'react-hot-toast';
import useEmail from 'src/hooks/useEmail';
import useIdentity from 'src/hooks/useIdentity';

const fill = (message: any) => chrome?.runtime?.sendMessage(message);

const ActionButton = ({
  onClick,
  label,
  icon,
  className,
}: {
  onClick: () => void;
  label: string;
  icon: ReactElement;
  className?: string;
}) => {
  const Icon = () => icon;
  return (
    <button
      className={`flex items-center duration-300 hover:scale-105 px-2 py-2 rounded-lg text-gray-50 w-full my-1 ${className}`}
      onClick={onClick}
    >
      <Icon />
      <span className='mx-4 font-medium'>{label}</span>
    </button>
  );
};
const Identity = () => {
  const { identity, newIdentity } = useIdentity();
  const { otp } = useEmail();
  return (
    <>
      <div className='flex flex-col w-44 h-screen px-4 py-8 overflow-y-auto'>
        <div className='flex flex-col items-center -mx-2'>
          <img
            className='object-cover w-24 h-24 mx-2 rounded-full border-2 border-white'
            src={identity?.avatar}
            alt='avatar'
          />
          <h4 className='mx-2 mt-3 font-medium text-lg text-gray-200'>
            {identity?.name}
          </h4>
        </div>
        <div className='flex flex-col items-center flex-1 mt-6'>
          <ActionButton
            label='New Identity'
            className='bg-teal-800'
            icon={
              <svg
                className='w-5 h-5'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            }
            onClick={() => {
              newIdentity();
              toast.success('Created a new identity!');
            }}
          />
          <ActionButton
            label='Autofill'
            className='border border-gray-400'
            icon={
              <svg
                className='w-5 h-5'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            }
            onClick={() => {
              fill({ ...identity, otp, verification_code: otp, code: otp });
              toast.success('Page autofilled!');
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Identity;
