const FillButton = ({ fillData }: { fillData: Record<string, unknown> }) => {
  const fill = (message: any) => chrome?.runtime?.sendMessage(message);

  return (
    <button
      onClick={() => fill(fillData)}
      className='px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform rounded-md bg-slate-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'
    >
      Fill
    </button>
  );
};

export default FillButton;
