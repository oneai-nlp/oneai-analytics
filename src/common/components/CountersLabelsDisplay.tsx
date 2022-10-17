import React from 'react';
import { CountersConfiguration, CounterType } from '../types/CustomizeBarTypes';
import { MetaData } from '../types/modals';
import { calculateCounter } from '../utils/CountersUtils';

export default function CountersLabelsDisplay({
  counters,
  labels,
  metadata,
  countersConfiguration,
}: {
  counters: CounterType[];
  labels: string[];
  metadata: MetaData;
  countersConfiguration: CountersConfiguration;
}) {
  return (
    <span className="truncate flex">
      {counters
        .filter((counter) => counter.counterConfiguration !== null)
        .map((counter, i) => {
          const counterConfig = counter.counterConfiguration;
          if (!counterConfig) return <></>;
          const displayResult = calculateCounter(
            counter,
            metadata,
            countersConfiguration
          );
          if (!displayResult.counter) return <></>;

          return (
            <span
              key={i}
              data-tip={
                `${counter.counterConfiguration?.label} - ${counter.counterType.name}` +
                getMetadataValueTitle(
                  displayResult.metadata,
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
              {counter.counterType.type === 'percentage' && '%'}
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
