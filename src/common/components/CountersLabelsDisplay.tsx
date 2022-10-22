import React from 'react';
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
}: {
  counters: CounterType[];
  labels: string[];
  metadata: MetaData;
  countersConfiguration: CountersConfigurations;
}) {
  return (
    <span className="truncate flex">
      {counters
        .filter((counter) => counter.metadataKeyValue !== null)
        .map((counter, i) => {
          const metadataKeyValue = counter.metadataKeyValue;
          if (!metadataKeyValue) return <></>;
          const displayResult = counter.calculationConfiguration.calculate(
            metadataKeyValue,
            metadata,
            countersConfiguration
          );
          if (!displayResult.counter) return <></>;

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
        if (!meta) return <></>;
        return (
          <span key={i} className="ml-1 bg-slate-400 rounded-xl p-1">
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
