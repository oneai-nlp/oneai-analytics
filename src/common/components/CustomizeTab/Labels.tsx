import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import React, { Fragment, useState } from 'react';
import { uniqBy } from '../../utils/utils';
import DropdownOption from '../CountersLabels/DropdownOption';

export default function Labels({
  currentLabels,
  labelsOptions,
  labelsChanged,
  title = 'Labels',
}: {
  currentLabels: string[];
  labelsOptions: string[];
  labelsChanged: (labels: string[]) => void;
  title?: string;
}) {
  const [selectedLabels, setSelectedLabels] = useState(
    currentLabels as string[]
  );

  const handleChange = (newLabels: string[]) => {
    setSelectedLabels(newLabels);
    labelsChanged(newLabels);
  };

  return (
    <div className="w-full">
      <p className="text-xl text-white mb-1">{title}</p>
      <Listbox value={selectedLabels} onChange={handleChange} multiple>
        <div className="relative">
          <Listbox.Button className="relative cursor-default rounded-lg bg-[#272535] py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate lowercase first-letter:uppercase text-white">
              {selectedLabels.length === 0
                ? 'Select'
                : `${selectedLabels.length} labels selected`}
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
            <Listbox.Options className="fixed mt-1 z-10 max-h-60 overflow-auto rounded-md bg-[#272533] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {uniqBy(labelsOptions, (key) => key).map((key) => (
                <DropdownOption key={key} label={key} value={key} />
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
