import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import React, { Fragment, useState } from 'react';
import { CUSTOM_METADATA_KEY } from '../../types/configurations';
import {
  CalculationType as CalculationType,
  CounterConfiguration,
  CountersConfiguration,
  CounterType,
} from '../../types/CustomizeBarTypes';
import { getCounterGroups } from '../../utils/CountersUtils';
import { uniqBy } from '../../utils/utils';

export default function Counters({
  countersConfigurations,
  countersTypes,
  currentCounters,
  countersChanged,
}: {
  countersConfigurations: CountersConfiguration;
  countersTypes: CalculationType[];
  currentCounters: CounterType[];
  countersChanged: (counters: CounterType[]) => void;
}) {
  const addCounter = () => {
    countersChanged([
      ...currentCounters,
      { counterConfiguration: null, counterType: countersTypes[0] },
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
      <div className="flex w-full flex-wrap">
        {currentCounters.map((addedCounter, i) => (
          <div className="ml-1 mb-1" key={i}>
            <Counter
              counterData={addedCounter}
              countersConfigurations={countersConfigurations}
              countersTypes={countersTypes}
              counterDeleted={() => deleteCounter(i)}
              counterChanged={(counter) => updateCounter(i, counter)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addCounter}
          className="ml-1 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm px-2 py-2.5 text-center"
        >
          Add Counter
        </button>
      </div>
    </div>
  );
}

function Counter({
  counterData,
  countersConfigurations,
  countersTypes,
  counterDeleted,
  counterChanged,
}: {
  counterData: CounterType;
  countersConfigurations: CountersConfiguration;
  countersTypes: CalculationType[];
  counterDeleted: () => void;
  counterChanged: (counter: CounterType) => void;
}) {
  const counterConfigurationChangeHandler = (
    newCounterConfiguration: CounterConfiguration
  ) => {
    counterChanged({
      counterConfiguration: newCounterConfiguration,
      counterType: counterData.counterType,
    });
  };

  const counterChangeHandler = (newCounter: CalculationType) => {
    counterChanged({
      counterConfiguration: counterData.counterConfiguration,
      counterType: newCounter,
    });
  };

  return (
    <div className="w-full">
      <div className="flex bg-gray-200 rounded-full p-2 w-fit">
        <Listbox
          value={counterData.counterConfiguration}
          onChange={counterConfigurationChangeHandler}
        >
          <div className="relative">
            <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate lowercase first-letter:uppercase">
                {counterData.counterConfiguration
                  ? counterData.counterConfiguration.label
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
                {uniqBy(Object.keys(countersConfigurations), (key) => key).map(
                  (key, i) => (
                    <CascadedOption
                      countersConfigurations={countersConfigurations}
                      optionName={key}
                      index={i}
                      key={i}
                    />
                  )
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        <Listbox
          value={counterData.counterType}
          onChange={counterChangeHandler}
        >
          <div className="relative ml-1">
            <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate lowercase first-letter:uppercase">
                {counterData.counterType.name}
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
                  countersTypes,
                  counterData.counterConfiguration
                ).map((counter) => (
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
}: {
  countersConfigurations: CountersConfiguration;
  optionName: string;
  index: number;
}) {
  const [opened, setOpened] = useState(false);
  const configData = countersConfigurations[optionName];

  return (
    <Fragment key={index}>
      <div className="w-full flex">
        {configData.groups && configData.groups.length > 0 && (
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

        <Option label={optionName} value={configData} key={optionName} />
      </div>
      {opened &&
        uniqBy(configData.groups ?? [], (group) => group.label).map(
          (group, i) => {
            group.label = group.label?.includes(optionName)
              ? group.label
              : `${optionName}.${group.label ?? ''}`;
            return (
              <Option
                label={group.label}
                value={group}
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
  value: CounterConfiguration | CalculationType;
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
            {label.split('.').at(-1)}
          </span>
        </span>
      )}
    </Listbox.Option>
  );
}

function getCalculationTypes(
  calculationTypes: CalculationType[],
  selectedCounterConfig: CounterConfiguration | null
): CalculationType[] {
  if (!selectedCounterConfig)
    return calculationTypes.filter((calc) => !calc.hasGroups);
  if (selectedCounterConfig.label === CUSTOM_METADATA_KEY)
    return calculationTypes.filter((calc) => calc.name === 'Total SUM');
  const newLocal = getCounterGroups(selectedCounterConfig);
  const hasGroups = newLocal.length > 0;
  return calculationTypes.filter(
    (calc) => calc.hasGroups === hasGroups || !calc.hasGroups
  );
}
