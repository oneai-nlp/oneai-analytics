import { Listbox } from '@headlessui/react';
import CheckIcon from '@heroicons/react/20/solid/CheckIcon';
import React from 'react';
import {
  MetadataKeyValue,
  CalculationConfiguration,
} from '../../types/customizeBarTypes';

export default function DropdownOption({
  label,
  value,
  pl = 1,
}: {
  label: string;
  value: MetadataKeyValue | CalculationConfiguration;
  pl?: number;
}) {
  return (
    <Listbox.Option
      style={{ paddingLeft: pl + 'rem' }}
      className={({ active }) =>
        `relative cursor-default select-none py-2 pr-4 ${
          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
        }`
      }
      value={value}
    >
      {({ selected }) => (
        <span className="w-full flex">
          {selected ? (
            <span className="pr-2 pl-1 inset-y-0 left-0 flex items-center text-amber-600">
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : null}
          <span
            className={`block truncate lowercase first-letter:uppercase ${
              selected ? 'font-medium' : 'font-normal'
            }`}
          >
            {label}
          </span>
        </span>
      )}
    </Listbox.Option>
  );
}
