import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import React, { Fragment, useState } from 'react';
import { totalSumCalculationName } from '../../configurations/calculationsConfigurations';
import { CUSTOM_METADATA_KEY } from '../../configurations/commonConfigurations';
import {
  CalculationConfiguration,
  CountersConfigurations,
  CounterType,
  MetadataKeyValue,
} from '../../types/customizeBarTypes';
import { getMetadataKeyValueGroups } from '../../utils/countersUtils';
import { getMetadataKeyValueDisplay } from '../../utils/displayUtils';
import { uniqBy } from '../../utils/utils';

export default function Counters({
  countersConfigurations,
  calculationsConfigurations,
  currentCounters,
  countersChanged,
}: {
  countersConfigurations: CountersConfigurations;
  calculationsConfigurations: CalculationConfiguration[];
  currentCounters: CounterType[];
  countersChanged: (counters: CounterType[]) => void;
}) {
  const addCounter = (newMetadataKeyValue: MetadataKeyValue) => {
    const allowedCalculations = getCalculationTypes(
      calculationsConfigurations,
      newMetadataKeyValue,
      countersConfigurations
    );
    countersChanged([
      ...currentCounters,
      {
        metadataKeyValue: newMetadataKeyValue,
        calculationConfiguration: allowedCalculations[0],
      },
    ]);
  };

  const deleteCounter = (index: number) => {
    currentCounters.splice(index, 1);
    countersChanged([...currentCounters]);
  };

  const updateCounter = (index: number, updatedCounter: CounterType) => {
    currentCounters[index] = updatedCounter;
    countersChanged([...currentCounters]);
  };

  return (
    <div className="w-full">
      <p className="text-xl text-gray-600">Counters</p>
      <div className="flex w-full flex-wrap items-center">
        {currentCounters.map((addedCounter, i) => (
          <div className="ml-1 mb-1" key={i}>
            <Counter
              counterData={addedCounter}
              countersConfigurations={countersConfigurations}
              calculationsConfigurations={calculationsConfigurations}
              counterDeleted={() => deleteCounter(i)}
              counterChanged={(counter) => updateCounter(i, counter)}
            />
          </div>
        ))}
        <Listbox onChange={addCounter}>
          <div className="relative ml-1 mb-1">
            <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate lowercase first-letter:uppercase text-gray-800">
                Add counter
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
              <Listbox.Options className="fixed mt-1 z-10 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                    selected={false}
                    key={i}
                  />
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
}

function Counter({
  counterData,
  countersConfigurations,
  calculationsConfigurations,
  counterDeleted,
  counterChanged,
}: {
  counterData: CounterType;
  countersConfigurations: CountersConfigurations;
  calculationsConfigurations: CalculationConfiguration[];
  counterDeleted: () => void;
  counterChanged: (counter: CounterType) => void;
}) {
  const selectedMetadataKeyValueChangeHandler = (
    newMetadataKeyValue: MetadataKeyValue
  ) => {
    const allowedCalculations = getCalculationTypes(
      calculationsConfigurations,
      newMetadataKeyValue,
      countersConfigurations
    );
    counterChanged({
      metadataKeyValue: newMetadataKeyValue,
      calculationConfiguration: allowedCalculations.some(
        (calc) => calc.name === counterData.calculationConfiguration.name
      )
        ? counterData.calculationConfiguration
        : allowedCalculations[0],
    });
  };

  const counterChangeHandler = (newCounter: CalculationConfiguration) => {
    counterChanged({
      metadataKeyValue: counterData.metadataKeyValue,
      calculationConfiguration: newCounter,
    });
  };

  return (
    <div className="w-full">
      <div className="flex bg-gray-200 rounded-full p-2 w-fit">
        <Listbox
          value={counterData.metadataKeyValue}
          onChange={selectedMetadataKeyValueChangeHandler}
          by={(a, b) => a?.key === b?.key && a?.value === b?.value}
        >
          <div className="relative">
            <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate lowercase first-letter:uppercase text-gray-800">
                {counterData.metadataKeyValue
                  ? getMetadataKeyValueDisplay(counterData.metadataKeyValue)
                  : 'Select'}
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
              <Listbox.Options className="fixed mt-1 z-10 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                      (counterData.metadataKeyValue?.key ?? '') === key &&
                      counterData.metadataKeyValue?.value !== undefined
                    }
                    key={i}
                  />
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        <Listbox
          value={counterData.calculationConfiguration}
          onChange={counterChangeHandler}
          by="name"
        >
          <div className="relative ml-1">
            <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate lowercase first-letter:uppercase text-gray-800">
                {counterData.calculationConfiguration.name}
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
              <Listbox.Options className="fixed mt-1 z-10 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {getCalculationTypes(
                  calculationsConfigurations,
                  counterData.metadataKeyValue,
                  countersConfigurations
                )
                  .sort(function (a, b) {
                    const textA = a.name.toLowerCase();
                    const textB = b.name.toLowerCase();
                    return textA < textB ? -1 : textA > textB ? 1 : 0;
                  })
                  .map((counter) => (
                    <Option
                      label={counter.name}
                      value={counter}
                      key={counter.name}
                    />
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        <button type="button" className="ml-1" onClick={counterDeleted}>
          <XMarkIcon className="h-4 w-4 text-gray-600 hover:scale-125 transition duration-100 ease-linear" />
          <span className="sr-only">Delete counter</span>
        </button>
      </div>
    </div>
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

        <Option
          label={optionName}
          value={{ key: optionName } as MetadataKeyValue}
          key={optionName}
        />
      </div>
      {opened &&
        uniqBy(configData.items ?? [], (group) => group.label).map(
          (group, i) => {
            return (
              <Option
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

function Option({
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

function getCalculationTypes(
  calculationTypes: CalculationConfiguration[],
  selectedMetadataKeyValue: MetadataKeyValue | null,
  countersConfiguration: CountersConfigurations
): CalculationConfiguration[] {
  if (!selectedMetadataKeyValue)
    return calculationTypes.filter((calc) => !calc.hasGroups);
  if (selectedMetadataKeyValue.key === CUSTOM_METADATA_KEY)
    return calculationTypes.filter(
      (calc) => calc.name === totalSumCalculationName
    );
  const hasGroups =
    getMetadataKeyValueGroups(selectedMetadataKeyValue, countersConfiguration)
      .length > 0;

  return calculationTypes.filter(
    (calc) => calc.hasGroups === hasGroups || !calc.hasGroups
  );
}
