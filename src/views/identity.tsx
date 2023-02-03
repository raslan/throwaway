import { Fragment, ReactElement } from 'react';
import ReactCreditCard from 'react-credit-cards';
import { toast } from 'react-hot-toast';
import useEmail from 'src/hooks/useEmail';
import useIdentity from 'src/hooks/useIdentity';

const fill = (message: any) => chrome?.runtime?.sendMessage(message);

const displayedIdentityKeys = [
  'email',
  'card_verification',
  'job_title',
  'first_name',
  'last_name',
  'state',
  'city',
  'street_address',
  'street',
  'zipcode',
  'phone',
  'country',
  'company',
  'organization',
  'username',
  'password',
  'suite',
  'apartment',
  'dateofbirth',
];

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
      <div className='flex w-full'>
        <div className='flex flex-col w-1/3 h-screen px-4 py-8 overflow-y-auto'>
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
                    d='M10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z'
                    fill='currentColor'
                  />
                  <path
                    d='M16.9451 14.8921C15.8405 14.8921 14.9451 15.7875 14.9451 16.8921C14.9451 17.9967 15.8405 18.8921 16.9451 18.8921C18.0496 18.8921 18.9451 17.9967 18.9451 16.8921C18.9451 15.7875 18.0496 14.8921 16.9451 14.8921Z'
                    fill='currentColor'
                  />
                  <path
                    d='M5.05518 7.05518C5.05518 5.95061 5.95061 5.05518 7.05518 5.05518C8.15975 5.05518 9.05518 5.95061 9.05518 7.05518C9.05518 8.15975 8.15975 9.05518 7.05518 9.05518C5.95061 9.05518 5.05518 8.15975 5.05518 7.05518Z'
                    fill='currentColor'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M1 4C1 2.34315 2.34315 1 4 1H20C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4ZM4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3Z'
                    fill='currentColor'
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
