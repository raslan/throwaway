const IconButton = ({
  component,
  label,
  active,
  onClick,
}: {
  component: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 ${
        active ? `bg-gray-700 text-gray-200` : `text-gray-400`
      }`}
    >
      {component}
      <span className='mx-4 font-medium'>{label}</span>
    </button>
  );
};

export default IconButton;
