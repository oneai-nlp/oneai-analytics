import { Listbox, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import React, { Fragment, useState } from 'react';
import {
  CountersConfigurations,
  MetadataKeyValue,
} from '../../types/customizeBarTypes';
import { uniqBy } from '../../utils/utils';
import DropdownOption from './DropdownOption';

export default function LabelsFiltersSelect({
  metadataKeyValue,
  countersConfigurations,
  selectedMetadataKeyValueChange,
}: {
  metadataKeyValue: MetadataKeyValue | null;
  selectedMetadataKeyValueChange: (
    newMetadataKeyValue: MetadataKeyValue
  ) => void;
  countersConfigurations: CountersConfigurations;
}) {
  return (
    <Listbox
      value={metadataKeyValue}
      onChange={(newMetadataKeyValue) =>
        newMetadataKeyValue?.value
          ? selectedMetadataKeyValueChange(newMetadataKeyValue)
          : null
      }
      by={(a, b) => a?.key === b?.key && a?.value === b?.value}
    >
      <div className="relative">
        <Listbox.Button className="relative rounded-lg  py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
          <span
            className="block truncate lowercase first-letter:uppercase text-black dark:text-white !text-xl"
            style={{ width: '1em', height: '1em' }}
          >
            <FunnelIcon />
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
          <Listbox.Options className="fixed mt-1 z-10 max-h-60 scrollbar-thin scrollbar-thumb-[#747189] scrollbar-track-[#272533] overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full rounded-md bg-gray-600 dark:bg-[#272533] py-1 text-base shadow-lg ring-1 ring-gray-500 dark:ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {uniqBy(
              Object.keys(countersConfigurations).sort((a, b) =>
                a < b ? -1 : a > b ? 1 : 0
              ),
              (key) => key
            )
              .filter(
                (meta) => (countersConfigurations[meta]?.items?.length ?? 0) > 0
              )
              .map((key, i) => (
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
        <MetadataTitle label={optionName} key={optionName} />

        {configData.items && configData.items.length > 0 && (
          <button
            type="button"
            className="ml-auto mr-3"
            onClick={() => setOpened((opened) => !opened)}
          >
            {opened ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-300 " />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-300 " />
            )}
            <span className="sr-only">Open or Close metadata</span>
          </button>
        )}
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
                pl={2}
                key={optionName + group.label + i.toString()}
              />
            );
          }
        )}
    </Fragment>
  );
}

function MetadataTitle({ label }: { label: string }) {
  return (
    <Listbox.Option
      style={{ paddingLeft: '1rem' }}
      className={({ active }) =>
        `relative cursor-default select-none py-2 pr-4 ${
          active
            ? 'bg-gray-400 dark:bg-[#444154] text-white'
            : 'text-gray-300 dark:text-[#747189]'
        }`
      }
      value={label}
    >
      <span className="w-full flex">
        <div className="flex items-center">
          <label
            className={`text-sm ml-2 font-medium text-gray-900 dark:text-gray-300 block truncate lowercase first-letter:uppercase`}
          >
            {label}
          </label>
        </div>
      </span>
    </Listbox.Option>
  );
}
