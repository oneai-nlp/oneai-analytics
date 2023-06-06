import { Listbox, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import React, { Fragment, useRef, useState } from 'react';
import {
  CountersConfigurations,
  MetadataKeyValue,
} from '../../types/customizeBarTypes';
import { uniqBy } from '../../utils/utils';

export default function LabelsFiltersSelect({
  selectedLabels,
  countersConfigurations,
  selectedMetadataKeyValueChange,
}: {
  selectedLabels: MetadataKeyValue[];
  selectedMetadataKeyValueChange: (
    newMetadataKeyValue: MetadataKeyValue
  ) => void;
  countersConfigurations: CountersConfigurations;
}) {
  const [position, setPosition] = React.useState(false);
  const ref = useRef(null);

  const onClick = () => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        if (ref.current) {
          //@ts-ignore
          const popover = ref.current.getBoundingClientRect();

          if (popover.bottom >= screen.height) {
            setPosition(true);
          } else {
            setPosition(false);
          }
        }
      }, 100);
    }
  };

  return (
    <Listbox>
      <div className="relative">
        <Listbox.Button
          className="relative rounded-lg  py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm"
          onClick={onClick}
        >
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
          <Listbox.Options
            ref={ref}
            className={`fixed ${
              position ? '-mt-[200px]' : 'mt-3'
            } z-10 max-h-60 scrollbar-thin scrollbar-thumb-[#747189] scrollbar-track-[#272533] 
          overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full rounded-md bg-gray-600 
          dark:bg-[#272533] py-1 text-base shadow-lg ring-1 ring-gray-500 dark:ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
          >
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
                  selected={selectedLabels ?? []}
                  labelClicked={selectedMetadataKeyValueChange}
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
  labelClicked,
}: {
  countersConfigurations: CountersConfigurations;
  optionName: string;
  index: number;
  selected: MetadataKeyValue[];
  labelClicked: (newMetadataKeyValue: MetadataKeyValue) => void;
}) {
  const keySelected = selected.some((s) => s.key === optionName);
  const [opened, setOpened] = useState(keySelected);
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
              <ChevronUpIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
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
                selected={selected.some(
                  (keyVal) =>
                    keyVal.key === optionName && keyVal.value === group.label
                )}
                labelClicked={labelClicked}
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

function DropdownOption({
  label,
  value,
  selected,
  labelClicked,
  pl = 1,
}: {
  label: string;
  value: MetadataKeyValue;
  selected: boolean;
  labelClicked: (newMetadataKeyValue: MetadataKeyValue) => void;
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
      onClick={() => labelClicked(value)}
      value={value}
    >
      <span className="w-full flex">
        <div className="flex items-center">
          <input
            checked={selected}
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
