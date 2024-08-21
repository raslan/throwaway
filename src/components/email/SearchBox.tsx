import { Search } from 'lucide-react';

interface SearchBoxProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchBox = ({ search, setSearch }: SearchBoxProps) => {
  return (
    <div className='flex items-center border border-primary/50 px-6 py-0.5 rounded-md has-[:focus]:border-primary'>
      <Search className='mr-2 h-4 w-4 shrink-0' />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type='text'
        placeholder='Search...'
        className='bg-transparent outline-none border-none h-9 w-full px-3 py-2'
      />
    </div>
  );
};

export default SearchBox;
