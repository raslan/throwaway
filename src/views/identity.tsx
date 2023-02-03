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
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M8.20348 2.00378C9.46407 2.00378 10.5067 3.10742 10.6786 4.54241L19.1622 13.0259L11.384 20.8041C10.2124 21.9757 8.31291 21.9757 7.14134 20.8041L2.8987 16.5615C1.72713 15.3899 1.72713 13.4904 2.8987 12.3188L5.70348 9.51404V4.96099C5.70348 3.32777 6.82277 2.00378 8.20348 2.00378ZM8.70348 4.96099V6.51404L7.70348 7.51404V4.96099C7.70348 4.63435 7.92734 4.36955 8.20348 4.36955C8.47963 4.36955 8.70348 4.63435 8.70348 4.96099ZM8.70348 10.8754V9.34247L4.31291 13.733C3.92239 14.1236 3.92239 14.7567 4.31291 15.1473L8.55555 19.3899C8.94608 19.7804 9.57924 19.7804 9.96977 19.3899L16.3337 13.0259L10.7035 7.39569V10.8754C10.7035 10.9184 10.7027 10.9612 10.7012 11.0038H8.69168C8.69941 10.9625 8.70348 10.9195 8.70348 10.8754Z'
                    fill='currentColor'
                  />
                  <path
                    d='M16.8586 16.8749C15.687 18.0465 15.687 19.946 16.8586 21.1175C18.0302 22.2891 19.9297 22.2891 21.1013 21.1175C22.2728 19.946 22.2728 18.0465 21.1013 16.8749L18.9799 14.7536L16.8586 16.8749Z'
                    fill='currentColor'
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
