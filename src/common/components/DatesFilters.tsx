import { Popover, Transition } from '@headlessui/react';
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import React, { Fragment } from 'react';
import Datepicker from './CustomizeTab/Datepicker';

export default function DatesFilters({
  fromDate,
  toDate,
  fromDateChanged,
  toDateChanged,
  trendPeriods,
  trendPeriodsChanged,
}: {
  fromDate: Date | null;
  toDate: Date | null;
  fromDateChanged: (date: Date | null) => void;
  toDateChanged: (date: Date | null) => void;
  trendPeriods?: number;
  trendPeriodsChanged?: (index: number) => void;
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
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            onClick={onClick}
            className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-500 dark:text-white hover:text-opacity-100 focus:outline-none `}
          >
            <CalendarDaysIcon className="h-7 w-7" />
            <ChevronDownIcon
              className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-[#747189] transition duration-150 ease-in-out group-hover:text-opacity-80`}
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
                position ? '-mt-[300px]' : 'mt-3'
              } transform max-w-md`}
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-gray-500 dark:ring-black ring-opacity-5">
                <div className="relative bg-white dark:bg-[#272535] p-5">
                  <div className="w-full">
                    <div className="flex flex-wrap w-full mt-3 justify-between">
                      <div className="flex items-center">
                        <Datepicker
                          selectedDate={fromDate}
                          dateChanged={fromDateChanged}
                          placeholder="From"
                        />
                        <div className="ml-1">
                          <button
                            type="button"
                            onClick={() => fromDateChanged(null)}
                          >
                            <XMarkIcon className="h-4 w-4 text-gray-500 dark:text-gray-200 hover:scale-125 transition duration-100 ease-linear" />
                            <span className="sr-only">Clear dates filters</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Datepicker
                          selectedDate={toDate}
                          dateChanged={toDateChanged}
                          placeholder="To"
                        />
                        <div className="ml-1">
                          <button
                            type="button"
                            onClick={() => toDateChanged(null)}
                          >
                            <XMarkIcon className="h-4 w-4 text-gray-200 hover:scale-125 transition duration-100 ease-linear" />
                            <span className="sr-only">Clear dates filters</span>
                          </button>
                        </div>
                      </div>
                      {trendPeriods !== undefined && trendPeriodsChanged && (
                        <div className="flex items-center">
                          <div>
                            <label
                              htmlFor="small-input"
                              className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300"
                            >
                              Trend periods amount
                            </label>
                            <input
                              type="number"
                              id="small-input"
                              onChange={(e) =>
                                trendPeriodsChanged(Number(e.target.value))
                              }
                              value={trendPeriods}
                              className="block p-2 w-1/2 rounded-lg border sm:text-xs bg-gray-300 dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-700 dark:placeholder-gray-400 text-gray-500 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
