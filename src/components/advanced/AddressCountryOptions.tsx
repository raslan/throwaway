import SubLabel from '@/components/advanced/SubLabel';
import { CountryFlag } from '@/components/CountryFlag';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useAdvancedMode from '@/hooks/useAdvancedMode';

const countries = ['United States', 'Spain', 'United Kingdom'];

const AddressCountryOptions = () => {
  const { localeIndex, setAdvanced } = useAdvancedMode();

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-col gap-1'>
        <Label className='text-lg'>Address Country</Label>
        <SubLabel>Country for the address and financial data.</SubLabel>
      </div>
      <div className='w-1/3'>
        <Select
          defaultValue={countries[localeIndex]}
          onValueChange={(value) =>
            setAdvanced({ localeIndex: countries.indexOf(value) })
          }
        >
          <SelectTrigger>
            <SelectValue>
              <div className='flex items-center gap-2'>
                <div className='w-5 h-5 flex'>
                  <CountryFlag country={countries[localeIndex]} />
                </div>
                {countries[localeIndex]}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                <div className='flex items-center gap-1'>
                  <div className='w-5 h-5 flex'>
                    <CountryFlag country={country} />
                  </div>
                  <div>{country}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AddressCountryOptions;
