const EmailPreview = ({ subject, from, onClick = () => {} }: Props) => {
  return (
    <button
      onClick={onClick}
      className='flex flex-col w-full h-24 px-6 py-4 m-auto mt-4 overflow-hidden text-left bg-gray-800 border-transparent rounded-md group hover:bg-gray-700 max-h-72'
    >
      <p className='w-screen max-w-full overflow-hidden text-base font-medium text-gray-100 whitespace-nowrap overflow-ellipsis group-hover:underline first-letter:capitalize'>
        {subject}
      </p>
      <p className='mt-3 text-sm text-gray-300 first-letter:capitalize'>
        {from}
      </p>
    </button>
  );
};

type Props = {
  subject: string;
  from: string;
  onClick?: () => void;
};

export default EmailPreview;
