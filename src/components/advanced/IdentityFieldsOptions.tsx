import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/datatable';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import SwitchToggle from '@/components/advanced/SwitchToggle';
import { ChevronUpIcon, MinusCircleIcon, PlusCircleIcon } from 'lucide-react';
import useAdvancedMode from '@/hooks/useAdvancedMode';
import useIdentity from '@/hooks/useIdentity';
import { ColumnDef } from '@tanstack/react-table';

const IdentityFieldsOptions = () => {
  const { addIdentityFields, setAdvanced } = useAdvancedMode();
  const { identity, addCustomIdentityField, removeCustomIdentityField } =
    useIdentity();
  const [field, setField] = useState('');
  const [value, setValue] = useState('');

  const data = useMemo(() => {
    return Object?.keys?.(identity.extra || {})?.map?.((key) => ({
      field: key,
      value: identity.extra[key],
    }));
  }, [identity]);

  useEffect(() => {
    return () => {
      setField('');
      setValue('');
    };
  }, []);

  const columns: ColumnDef<{ field: string; value: string }>[] = useMemo(
    () => [
      {
        accessorKey: 'field',
        header: 'Custom Field',
      },
      {
        accessorKey: 'value',
        header: 'Value',
        cell: ({ row }) => (
          <p className='truncate max-w-sm'>{row.original.value}</p>
        ),
      },
      {
        accessorKey: 'actions',
        header: () => <div className='text-right'>Actions</div>,
        cell: ({ row }) => (
          <Button
            variant='expandIcon'
            iconPlacement='left'
            Icon={() => <span>Remove</span>}
            className='float-right'
            onClick={() => removeCustomIdentityField(row.original.field)}
          >
            <MinusCircleIcon className='ml-10 w-5 h-5' />
          </Button>
        ),
      },
    ],
    [removeCustomIdentityField]
  );

  return (
    <div>
      <SwitchToggle
        label='Modify Identity Fields'
        description='Add or modify identity fields'
        id='modify-identity-fields'
        checked={addIdentityFields}
        onCheckedChange={() =>
          setAdvanced({ addIdentityFields: !addIdentityFields })
        }
      />
      {addIdentityFields && (
        <>
          <Separator className='my-1 bg-transparent' />
          <Sheet>
            <SheetTrigger>
              <Button variant='default'>Click to Manage</Button>
            </SheetTrigger>
            <SheetContent className='h-[95%]' side='bottom'>
              <SheetClose asChild>
                <Button className='w-full gap-3' variant='secondary'>
                  Click Here To Exit <ChevronUpIcon />
                </Button>
              </SheetClose>
              <SheetDescription className='flex flex-col gap-2 text-primary'>
                <div className='flex items-end justify-between w-full gap-5 mt-4'>
                  <div className='flex flex-col justify-between gap-3 w-full'>
                    <Label className='text-base'>
                      Field Name (duplicates will overwrite):
                    </Label>
                    <Input
                      type='text'
                      className='text-base'
                      placeholder="What's the field called?"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                    />
                  </div>
                  <div className='flex flex-col justify-between gap-3 w-full'>
                    <Label className='text-base'>New Value:</Label>
                    <Input
                      type='text'
                      className='text-base'
                      placeholder='What value should we fill?'
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <Button
                    variant='expandIcon'
                    iconPlacement='left'
                    className='group'
                    Icon={() => <span>Add</span>}
                    onClick={() => {
                      if (field && value) {
                        addCustomIdentityField(field.toLowerCase(), value);
                      }
                    }}
                  >
                    <PlusCircleIcon className='group-hover:ml-5 transition-all duration-200' />
                  </Button>
                </div>
                <Separator className='bg-primary/10' />
                {data.length > 0 && (
                  <DataTable
                    columns={columns}
                    data={data}
                    searchableColumnName='Search fields...'
                    searchColumn='field'
                    pageSize={3}
                  />
                )}
              </SheetDescription>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
};

export default IdentityFieldsOptions;
