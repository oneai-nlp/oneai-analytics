import { Listbox } from '@headlessui/react';
import React from 'react';
import {
  CalculationConfiguration,
  MetadataKeyValue,
} from '../../types/customizeBarTypes';

export default function DropdownOption({
  label,
  value,
  pl = 1,
}: {
  label: string;
  value: MetadataKeyValue | CalculationConfiguration | string;
  pl?: number;
}) {
  return (
    <Listbox.Option
      style={{ paddingLeft: pl + 'rem' }}
      className={({ active }) =>
        `relative cursor-default select-none py-2 pr-4 ${
          active
            ? 'bg-gray-400 dark:bg-[#444154] text-white'
            : 'text-gray-300 dark:text-[#747189]'
        }`
      }
      value={value}
    >
      {({ selected }) => (
        <span className="w-full flex">
          <div className="flex items-center">
            <input
              checked={selected}
              onChange={() => {}}
              type="radio"
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
      )}
    </Listbox.Option>
  );
}
