import { useEffect, useState } from 'react';
import { Field, Label, Switch } from '@headlessui/react';
import { useIsFirstRender } from 'src/hooks/useIsFirstRender';

export default function SwitchToggle({
  onToggle,
  label,
  defaultVal,
  description,
}: Props) {
  const [enabled, setEnabled] = useState(defaultVal);
  const firstRender = useIsFirstRender();

  useEffect(() => {
    if (firstRender) setEnabled(defaultVal);
  }, [defaultVal]);

  useEffect(() => {
    if (!firstRender) onToggle(enabled);
  }, [enabled]);

  return (
    <div className='flex flex-col gap-2 justify-center w-full'>
      <Field>
        <div className='flex justify-between items-center pr-3'>
          <Label className='font-bold text-sm'>{label}</Label>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${enabled ? 'bg-teal-600' : 'bg-gray-500'}
    relative inline-flex h-[20px] w-[45px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className='sr-only'>Use setting</span>
            <span
              aria-hidden='true'
              className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
      pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <Label className='text-xs text-gray-300'>{description}</Label>
      </Field>
    </div>
  );
}

type Props = {
  onToggle: (state: boolean) => void;
  label: string;
  defaultVal: boolean;
  description: string;
};
