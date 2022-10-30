import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { Fragment } from 'react';
import {
  CalculationConfiguration,
  CountersConfigurations,
  CounterType,
  MetadataKeyValue,
} from '../types/customizeBarTypes';
import KeyValueSingleSelect from './CountersLabels/KeyValueSingleSelect';
import Counters from './CustomizeTab/Counters';
import Labels from './CustomizeTab/Labels';

export default function CustomizeTab({
  currentCounters,
  selectedLabels,
  countersConfigurations,
  calculationsConfigurations,
  labelsOptions,
  countersChanged,
  labelsChanged,
  currentColorsAxis,
  selectedSizeAxis,
  colorsAxisChanged,
  sizeAxisChanged,
}: {
  currentCounters: CounterType[];
  selectedLabels: string[];
  countersConfigurations: CountersConfigurations;
  calculationsConfigurations: CalculationConfiguration[];
  labelsOptions: string[];
  countersChanged: (counters: CounterType[]) => void;
  labelsChanged: (labels: string[]) => void;
  currentColorsAxis: string[];
  selectedSizeAxis: MetadataKeyValue | null;
  colorsAxisChanged: (counters: string[]) => void;
  sizeAxisChanged: (metadataKeyValue: MetadataKeyValue) => void;
}) {
  return (
    <div className="max-w-sm">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none `}
            >
              <span>Customize</span>
              <ChevronDownIcon
                className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-orange-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                tabIndex={0}
                className="absolute z-10 mt-3 w-screen max-w-sm transform lg:max-w-4xl"
              >
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-white p-5 max-h-[85vh] overflow-y-scroll overflow-x-hidden">
                    <div className="w-full">
                      <Counters
                        countersConfigurations={countersConfigurations}
                        calculationsConfigurations={calculationsConfigurations}
                        currentCounters={currentCounters}
                        countersChanged={countersChanged}
                        addCounterText="Add counter"
                        title="Counters"
                      />
                    </div>
                    <div className="w-full mt-2">
                      <Labels
                        currentLabels={selectedLabels}
                        labelsOptions={labelsOptions.sort()}
                        labelsChanged={labelsChanged}
                      />
                    </div>
                    <div className="w-full mt-2">
                      <p className="text-xl text-gray-600">Size Axis</p>
                      <KeyValueSingleSelect
                        metadataKeyValue={selectedSizeAxis}
                        placeholder="Select"
                        countersConfigurations={countersConfigurations}
                        selectedMetadataKeyValueChange={sizeAxisChanged}
                      />
                    </div>
                    <div className="w-full mt-2">
                      <Labels
                        currentLabels={currentColorsAxis}
                        labelsOptions={labelsOptions.sort()}
                        labelsChanged={colorsAxisChanged}
                        title="Color Axis"
                      />
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
