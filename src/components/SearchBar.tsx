const SearchBar = ({ search, setSearch, className }: Props) => {
  return (
    <div className={`relative ${className}`}>
      <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
        <svg className='w-5 h-5 text-gray-400' viewBox='0 0 24 24' fill='none'>
          <path
            d='M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </span>
      <input
        type='text'
        className='w-full py-3 pl-10 pr-4  border rounded-md bg-gray-800 text-gray-300 border-gray-600 focus:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring'
        placeholder='Search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

type Props = {
  search: string;
  setSearch: (search: string) => void;
  className?: string;
};

export default SearchBar;
