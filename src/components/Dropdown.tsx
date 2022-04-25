import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

const Dropdown = ({ className, setSelected, setting }: Props) => {
  return (
    <div className={`w-full ${className}`}>
      <Listbox value={setting.value} onChange={(value) => setSelected(value)}>
        <div className='relative mt-1'>
          <Listbox.Label className='capitalize'>{setting.name}</Listbox.Label>
          <Listbox.Button className='relative w-full mt-2 py-2 pl-3 pr-10 text-left bg-gray-800 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-gray-800 focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm text-white'>
            <span className='block truncate'>{setting.value.toString()}</span>
            <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M8 9l4-4 4 4m0 6l-4 4-4-4'
                />
              </svg>
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-base bg-gray-700 rounded-md shadow-lg max-h-60 ring-1 ring-white ring-opacity-5 focus:outline-none sm:text-sm z-10'>
              {setting.options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                      active ? "text-black bg-gray-100" : "text-white"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.toString()}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

type Props = {
  className?: string;
  setSelected: (value: any) => void;
  setting: {
    name: string;
    options: (string | boolean | number)[];
    value: string | boolean | number;
  };
};

export default Dropdown;
