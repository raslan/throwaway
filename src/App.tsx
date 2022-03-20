import { faker } from "@faker-js/faker";

function App() {
  const fill = (message: any) => chrome?.runtime?.sendMessage(message);
  return (
    <div className='bg-slate-900 w-[640px] h-[400px] text-white flex flex-col'>
      <button
        onClick={() => fill(faker.helpers.contextualCard())}
        className='px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'
      >
        Fill Form
      </button>
    </div>
  );
}

export default App;
