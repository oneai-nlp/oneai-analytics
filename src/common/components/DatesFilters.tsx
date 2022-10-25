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
}: {
  fromDate: Date | null;
  toDate: Date | null;
  fromDateChanged: (date: Date | null) => void;
  toDateChanged: (date: Date | null) => void;
}) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none `}
          >
            <CalendarDaysIcon className="h-7 w-7" />
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
              className="absolute z-10 mt-3 transform max-w-md"
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative bg-white p-5">
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
                            <XMarkIcon className="h-4 w-4 text-gray-600 hover:scale-125 transition duration-100 ease-linear" />
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
                            <XMarkIcon className="h-4 w-4 text-gray-600 hover:scale-125 transition duration-100 ease-linear" />
                            <span className="sr-only">Clear dates filters</span>
                          </button>
                        </div>
                      </div>
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
