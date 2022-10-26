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
  labelClicked,
}: {
  counters: CounterType[];
  labels: string[];
  metadata: MetaData;
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
}) {
  return (
    <span className="truncate flex w-full items-center">
      {counters
        .filter((counter) => counter.metadataKeyValue !== null)
        .map((counter, i) => (
          <div key={i} className="ml-1">
            <CounterDisplay
              counter={counter}
              countersConfiguration={countersConfiguration}
              metadata={metadata}
            />
          </div>
        ))}
      {labels.map((label, i) => (
        <div key={i} className="ml-1">
          <LabelDisplay
            key={i}
            countersConfiguration={countersConfiguration}
            label={label}
            labelClicked={labelClicked}
            metadata={metadata}
          />
        </div>
      ))}
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

function CounterDisplay({
  counter,
  metadata,
  countersConfiguration,
}: {
  counter: CounterType;
  metadata: MetaData;
  countersConfiguration: CountersConfigurations;
}) {
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
      data-tip={
        `${getMetadataKeyValueDisplay(metadataKeyValue)} - ${
          counter.calculationConfiguration.name
        }` +
        getMetadataValueTitle(displayResult.metadataKey, displayResult.value)
      }
      data-for="global"
      className={`flex items-center text-sm ${
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
}

function LabelDisplay({
  label,
  metadata,
  countersConfiguration,
  labelClicked,
}: {
  label: string;
  metadata: MetaData;
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
}) {
  const meta = metadata[label]?.reduce((prev, current) =>
    prev.count > current.count ? prev : current
  );
  if (!meta) return <></>;
  const config = countersConfiguration[label.toLowerCase()];
  return (
    <span
      className="flex items-center text-sm text-gray-500 p-1 cursor-pointer hover:text-gray-300"
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
}
