import React from 'react';
import {
  CountersConfigurations,
  CounterType,
} from '../../types/customizeBarTypes';
import { MetaData } from '../../types/modals';
import { getMetadataKeyValueDisplay } from '../../utils/displayUtils';

export default function CounterDisplay({
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
        displayResult.result > 0 && displayResult.counter.display
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
