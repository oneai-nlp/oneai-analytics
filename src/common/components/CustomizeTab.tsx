import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { Fragment } from 'react';
import {
  CalculationConfiguration,
  CounterType,
  CountersConfigurations,
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
  currentColorsAxis: CounterType[];
  selectedSizeAxis: MetadataKeyValue | null;
  colorsAxisChanged: (counters: CounterType[]) => void;
  sizeAxisChanged: (metadataKeyValue: MetadataKeyValue) => void;
}) {
  const [position, setPosition] = React.useState(false);
  const ref = React.useRef(null);

  const onClick = () => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        if (ref.current) {
          //@ts-ignore
          const popover = ref.current.getBoundingClientRect();

          if (popover.bottom >= window.innerHeight) {
            setPosition(true);
          } else {
            setPosition(false);
          }
        }
      }, 100);
    }
  };

  return (
    <div className="max-w-sm">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              onClick={onClick}
              className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-500 dark:text-black hover:text-opacity-100 focus:outline-none `}
            >
              <span className="text-[#747189] font-normal">Customize</span>
              <ChevronDownIcon
                className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-[#747189]  transition duration-150 ease-in-out group-hover:text-opacity-80`}
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
                ref={ref}
                className={`fixed z-10 ${
                  position ? '-mt-[400px]' : 'mt-3'
                } w-screen max-w-sm transform lg:max-w-4xl`}
              >
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-gray-500 dark:ring-black ring-opacity-5">
                  <div className="relative bg-white dark:bg-[#1D1C27] p-5 max-h-[85vh] text-gray-500 dark:text-white">
                    <div className="w-full">
                      <p className="text-xl mb-1">Size Axis</p>
                      <KeyValueSingleSelect
                        metadataKeyValue={selectedSizeAxis}
                        placeholder="Select"
                        countersConfigurations={countersConfigurations}
                        selectedMetadataKeyValueChange={sizeAxisChanged}
                      />
                    </div>
                    <div className="w-full mt-2">
                      <Counters
                        countersConfigurations={countersConfigurations}
                        calculationsConfigurations={calculationsConfigurations.filter(
                          (calc) => calc.type === 'percentage'
                        )}
                        currentCounters={currentColorsAxis}
                        countersChanged={colorsAxisChanged}
                        addCounterText="Add axis"
                        title="Color Axis"
                      />
                    </div>
                    <div className="w-full mt-2">
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
