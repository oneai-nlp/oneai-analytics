import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';
import { IGNORE_ID } from './constants';

export default function SingleSelect({
  options,
  selectedLabelId,
  onSelect,
}: {
  options: { id: string; label: string }[];
  selectedLabelId: string | null;
  onSelect: (selectedLabelId: string) => void;
}) {
  const selected = options.find((o) => o.id === (selectedLabelId ?? IGNORE_ID));

  return (
    <Listbox>
      <div className="relative bg-[#36334B] rounded-lg min-w-[100px]">
        <Listbox.Button className="relative text-left focus:outline-none text-sm flex items-center px-2 py-2 justify-between w-full">
          <span className="text-[#111111] dark:text-gray-300 text-sm mr-1">
            {selected?.label ?? 'Unknown'}
          </span>
          <span>
            <ChevronDownIcon
              className="h-4 w-4 text-gray-200"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 z-10 p-1 max-h-60 scrollbar-thin scrollbar-thumb-[#747189] scrollbar-track-[#272533] overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full rounded-md bg-gray-600 dark:bg-[#272533] py-1 text-base shadow-lg ring-1 ring-gray-500 dark:ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((key, i) => (
              <DropdownOption
                label={key.label}
                value={key.id}
                selected={selected?.id === key.id}
                labelClicked={onSelect}
                key={i}
              />
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

function DropdownOption({
  label,
  value,
  selected,
  labelClicked,
}: {
  label: string;
  value: string;
  selected: boolean;
  labelClicked: (label: string) => void;
}) {
  return (
    <Listbox.Option
      className={({ active }) =>
        `relative cursor-default select-none py-2 pr-4 ${
          active
            ? 'bg-gray-400 dark:bg-[#444154] text-white'
            : 'text-gray-300 dark:text-[#747189]'
        }`
      }
      onClick={() => labelClicked(value)}
      value={value}
    >
      <span className="w-full flex">
        <div className="flex items-center">
          <input
            checked={selected}
            onChange={() => {}}
            type="checkbox"
            className="w-4 h-4 text-[#4D4DFE] bg-gray-100 border-gray-300 focus:ring-[#4D4DFE] dark:ring-offset-gray-800 focus:ring-2 dark:bg-[#322F46] dark:border-[#322F46]"
          />
          <label
            className={`text-sm ml-2 font-medium text-gray-900 dark:text-gray-300 block truncate lowercase first-letter:uppercase ${
              selected ? 'font-medium' : 'font-normal'
            }`}
          >
            {label}
          </label>
        </div>
      </span>
    </Listbox.Option>
  );
}
