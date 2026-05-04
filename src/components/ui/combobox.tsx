import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, InboxIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';

const Combobox = ({
  value,
  setValue,
  options,
  displayOnly = false,
}: {
  value: string;
  setValue: (value: string) => void;
  options: { label: string; value: string }[];
  displayOnly?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const theme = useReadLocalStorage<string>('throwaway-theme');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full min-w-0 instrument-button justify-between h-11 px-4 m-0 gap-3 items-center truncate'
        >
          {!displayOnly ? (
            <InboxIcon className='w-4 h-4' strokeWidth={1.6} />
          ) : (
            <MailIcon className='w-4 h-4' strokeWidth={1.6} />
          )}
          <span className='min-w-0 truncate normal-case tracking-normal'>
            {value
              ? options.find((option) => option.value === value)?.label
              : 'Select email...'}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-[340px] p-0 ${theme}`}>
        <Command>
          <CommandInput className='text-sm' placeholder='Search email...' />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                  className='w-full text-lg font-semibold bg-background'
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
