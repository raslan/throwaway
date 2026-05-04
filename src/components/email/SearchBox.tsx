import { Search } from 'lucide-react';

interface SearchBoxProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchBox = ({ search, setSearch }: SearchBoxProps) => {
  return (
    <div className='flex items-center card-shell border border-white/20 px-4 py-2 rounded-lg has-[:focus]:border-primary/80'>
      <Search className='mr-2 h-4 w-4 shrink-0 text-primary' />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type='text'
        placeholder='Search...'
        className='bg-transparent outline-none border-none h-7 w-full'
      />
    </div>
  );
};

export default SearchBox;
