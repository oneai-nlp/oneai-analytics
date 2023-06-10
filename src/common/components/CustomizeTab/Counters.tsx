import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import React, { Fragment } from 'react';
import {
  topGroupPercentCalculationName,
  topValuePercentCalculationName,
} from '../../configurations/calculationsConfigurations';
import {
  CalculationConfiguration,
  CountersConfigurations,
  CounterType,
  MetadataKeyValue,
} from '../../types/customizeBarTypes';
import {
  getMetadataKeyValueGroups,
  hasMultipleMembers,
} from '../../utils/countersUtils';
import DropdownOption from '../CountersLabels/DropdownOption';
import KeyValueSingleSelect from '../CountersLabels/KeyValueSingleSelect';

export default function Counters({
  countersConfigurations,
  calculationsConfigurations,
  currentCounters,
  countersChanged,
  addCounterText,
  title,
}: {
  countersConfigurations: CountersConfigurations;
  calculationsConfigurations: CalculationConfiguration[];
  currentCounters: CounterType[];
  countersChanged: (counters: CounterType[]) => void;
  addCounterText: string;
  title: string;
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
        calculationConfiguration: getDefaultCalculation(allowedCalculations),
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
      <p className="text-xl text-gray-500 dark:text-white mb-1">{title}</p>
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
        <div className="ml-1">
          <KeyValueSingleSelect
            metadataKeyValue={null}
            countersConfigurations={countersConfigurations}
            selectedMetadataKeyValueChange={addCounter}
            placeholder={addCounterText}
          />
        </div>
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
        : getDefaultCalculation(allowedCalculations),
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
      <div className="flex bg-gray-200 dark:bg-[#272535] p-1 w-fit">
        <KeyValueSingleSelect
          metadataKeyValue={counterData.metadataKeyValue}
          countersConfigurations={countersConfigurations}
          selectedMetadataKeyValueChange={selectedMetadataKeyValueChangeHandler}
          placeholder="Select"
        />
        <Listbox
          value={counterData.calculationConfiguration}
          onChange={counterChangeHandler}
          by="name"
        >
          <div className="relative ml-1">
            <Listbox.Button className="relative rounded-lg bg-gray-200 dark:bg-[#272535] py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate lowercase first-letter:uppercase text-gray-700 dark:text-white">
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
              <Listbox.Options className="fixed mt-1 z-10 max-h-60 scrollbar-thin scrollbar-thumb-[#747189] scrollbar-track-[#272533] overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full rounded-md bg-gray-200 dark:bg-[#272533] py-1 text-base shadow-lg ring-1 ring-gray-500 dark:ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                    <DropdownOption
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
          <XMarkIcon className="h-4 w-4 text-gray-400 dark:text-gray-600 hover:scale-125 transition duration-100 ease-linear" />
          <span className="sr-only">Delete counter</span>
        </button>
      </div>
    </div>
  );
}

function getCalculationTypes(
  calculationTypes: CalculationConfiguration[],
  selectedMetadataKeyValue: MetadataKeyValue | null,
  countersConfiguration: CountersConfigurations
): CalculationConfiguration[] {
  if (!selectedMetadataKeyValue)
    return calculationTypes.filter(
      (calc) => !calc.hasGroups && !calc.hasMultipleMembers
    );

  const hasGroups =
    getMetadataKeyValueGroups(selectedMetadataKeyValue, countersConfiguration)
      .length > 0;
  if (hasGroups) return calculationTypes;

  const keyValueHasMultipleMembers = hasMultipleMembers(
    selectedMetadataKeyValue,
    countersConfiguration
  );
  if (keyValueHasMultipleMembers)
    return calculationTypes.filter((calc) => !calc.hasGroups);

  return calculationTypes.filter(
    (calc) => !calc.hasGroups && !calc.hasMultipleMembers
  );
}

function getDefaultCalculation(
  allowedCalculations: CalculationConfiguration[]
): CalculationConfiguration {
  return (
    allowedCalculations.find(
      (calc) => calc.name === topGroupPercentCalculationName
    ) ??
    allowedCalculations.find(
      (calc) => calc.name === topValuePercentCalculationName
    ) ??
    allowedCalculations[0]
  );
}
