import React, { Fragment } from 'react';
import {
  CountersConfigurations,
  CounterType,
} from '../types/customizeBarTypes';
import { MetaData } from '../types/modals';
import { getMetadataKeyValueDisplay } from '../utils/displayUtils';

export default function CountersLabelsDisplay({
  counters,
  labels,
  metadata,
  countersConfiguration,
  labelClicked,
}: {
  counters: CounterType[];
  labels: string[];
  metadata: MetaData;
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
}) {
  return (
    <span className="truncate flex w-full">
      {counters
        .filter((counter) => counter.metadataKeyValue !== null)
        .map((counter, i) => {
          const metadataKeyValue = counter.metadataKeyValue;
          if (!metadataKeyValue) return <Fragment key={i}></Fragment>;
          const displayResult = counter.calculationConfiguration.calculate(
            metadataKeyValue,
            metadata,
            countersConfiguration
          );
          if (!displayResult.counter) return <Fragment key={i}></Fragment>;

          return (
            <span
              key={i}
              data-tip={
                `${getMetadataKeyValueDisplay(metadataKeyValue)} - ${
                  counter.calculationConfiguration.name
                }` +
                getMetadataValueTitle(
                  displayResult.metadataKey,
                  displayResult.value
                )
              }
              data-for="global"
              className={`ml-1 flex items-center text-sm ${
                displayResult.counter.display
                  ? displayResult.counter.display.color === 'green'
                    ? 'text-emerald-400'
                    : displayResult.counter.display.color === 'red'
                    ? 'text-red-400'
                    : 'text-white'
                  : 'text-white'
              }`}
            >
              {displayResult.counter.display &&
                displayResult.counter.display.icon !== null && (
                  <span style={{ width: '1em', height: '1em' }}>
                    {displayResult.counter.display.icon}
                  </span>
                )}
              {displayResult.result}
              {counter.calculationConfiguration.type === 'percentage' && '%'}
            </span>
          );
        })}
      {labels.map((label, i) => {
        const meta = metadata[label]?.reduce((prev, current) =>
          prev.count > current.count ? prev : current
        );
        if (!meta) return <Fragment key={i}></Fragment>;
        const config = countersConfiguration[label.toLowerCase()];
        return (
          <span
            key={i}
            className="ml-1 flex items-center text-sm text-gray-500 p-1 cursor-pointer hover:text-gray-300"
            onClick={() => labelClicked(label, meta.value)}
          >
            {config && config.display && config.display.icon !== null && (
              <span style={{ width: '1em', height: '1em', marginRight: '1px' }}>
                {config.display.icon}
              </span>
            )}
            {meta.value ?? ''}
          </span>
        );
      })}
    </span>
  );
}

function getMetadataValueTitle(
  metadata: string | undefined,
  value: string | undefined
) {
  if (metadata) {
    if (value) return `(${metadata}.${value})`;
    return `(${metadata})`;
  }

  if (value) {
    return `(${value})`;
  }

  return '';
}
