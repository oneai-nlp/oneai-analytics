import { Listbox, Transition } from '@headlessui/react';
import {
  ChevronRightIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';
import React, { Fragment, useState } from 'react';
import {
  CountersConfigurations,
  MetadataKeyValue,
} from '../../types/customizeBarTypes';
import { getMetadataKeyValueDisplay } from '../../utils/displayUtils';
import { uniqBy } from '../../utils/utils';
import DropdownOption from './DropdownOption';

export default function KeyValueSingleSelect({
  metadataKeyValue,
  countersConfigurations,
  selectedMetadataKeyValueChange,
  placeholder,
}: {
  metadataKeyValue: MetadataKeyValue | null;
  selectedMetadataKeyValueChange: (
    newMetadataKeyValue: MetadataKeyValue
  ) => void;
  countersConfigurations: CountersConfigurations;
  placeholder: string;
}) {
  return (
    <Listbox
      value={metadataKeyValue}
      onChange={selectedMetadataKeyValueChange}
      by={(a, b) => a?.key === b?.key && a?.value === b?.value}
    >
      <div className="relative">
        <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate lowercase first-letter:uppercase text-gray-800">
            {metadataKeyValue
              ? getMetadataKeyValueDisplay(metadataKeyValue)
              : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
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
          <Listbox.Options className="absolute mt-1 z-10 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {uniqBy(
              Object.keys(countersConfigurations).sort((a, b) =>
                a < b ? -1 : a > b ? 1 : 0
              ),
              (key) => key
            ).map((key, i) => (
              <CascadedOption
                countersConfigurations={countersConfigurations}
                optionName={key}
                index={i}
                selected={
                  (metadataKeyValue?.key ?? '') === key &&
                  metadataKeyValue?.value !== undefined
                }
                key={i}
              />
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

function CascadedOption({
  countersConfigurations,
  optionName,
  index,
  selected,
}: {
  countersConfigurations: CountersConfigurations;
  optionName: string;
  index: number;
  selected: boolean;
}) {
  const [opened, setOpened] = useState(selected);
  const configData = countersConfigurations[optionName];

  return (
    <Fragment key={index}>
      <div className="w-full flex">
        {configData.items && configData.items.length > 0 && (
          <button
            type="button"
            className="ml-1"
            onClick={() => setOpened((opened) => !opened)}
          >
            {opened ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            )}
            <span className="sr-only">Open or Close metadata</span>
          </button>
        )}

        <DropdownOption
          label={optionName}
          value={{ key: optionName } as MetadataKeyValue}
          key={optionName}
        />
      </div>
      {opened &&
        uniqBy(configData.items ?? [], (group) => group.label).map(
          (group, i) => {
            return (
              <DropdownOption
                label={group.label ?? ''}
                value={
                  { key: optionName, value: group.label } as MetadataKeyValue
                }
                pl={3}
                key={optionName + group.label + i.toString()}
              />
            );
          }
        )}
    </Fragment>
  );
}
