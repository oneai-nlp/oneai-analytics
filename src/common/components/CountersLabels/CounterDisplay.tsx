import {
  ArrowDownIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/20/solid';
import React from 'react';
import {
  CountersConfigurations,
  CounterType,
} from '../../types/customizeBarTypes';
import { MetaData, Trend, UniqueItemsStats } from '../../types/modals';
import {
  getMetadataKeyValueDisplay,
  numberFormatter,
} from '../../utils/displayUtils';
import { customNumberToFixed, getNumberDescription } from '../../utils/utils';

export default function CounterDisplay({
  counter,
  metadata,
  countersConfiguration,
  trends,
  totalItems,
  width,
  maxWidth = '6ch',
  totalUniqueItemsStats,
  uniqueItemsStats,
  uniquePropertyName,
  signalsEnabled,
}: {
  counter: CounterType;
  metadata: MetaData;
  countersConfiguration: CountersConfigurations;
  trends: Trend[];
  totalItems: number;
  width?: string;
  maxWidth?: string;
  totalUniqueItemsStats?: UniqueItemsStats;
  uniqueItemsStats?: UniqueItemsStats;
  uniquePropertyName?: string;
  signalsEnabled?: boolean;
}) {
  const metadataKeyValue = counter.metadataKeyValue;
  if (!metadataKeyValue) return <></>;

  const displayResult = counter.calculationConfiguration.calculate(
    metadataKeyValue,
    metadata,
    trends,
    countersConfiguration,
    totalItems,
    totalUniqueItemsStats,
    uniqueItemsStats,
    uniquePropertyName
  );
  if (!displayResult.counter) return <></>;

  const keysToHide = ['positive', 'negative'];

  if (
    signalsEnabled === false &&
    keysToHide.includes(displayResult.metadataKey || '')
  ) {
    return <></>;
  }
  //
  return (
    <span
      data-tip={
        `${getMetadataKeyValueDisplay(metadataKeyValue)} - ${
          counter.calculationConfiguration.name
        }` +
        getMetadataValueTitle(displayResult.metadataKey, displayResult.value) +
        ' - ' +
        numberFormatter.format(customNumberToFixed(displayResult.result))
      }
      data-for="global"
      className={`flex items-center text-sm ${
        counter.calculationConfiguration.type !== 'trend' &&
        displayResult.result < 1
          ? 'text-gray-500 dark:text-gray-300'
          : displayResult.counter.display
          ? displayResult.counter.display.color === 'green'
            ? 'text-emerald-400'
            : displayResult.counter.display.color === 'red'
            ? 'text-red-400'
            : 'text-gray-500 dark:text-gray-300'
          : 'text-gray-500 dark:text-gray-300'
      }`}
    >
      {counter.calculationConfiguration.type === 'trend' &&
      displayResult.result > 0 ? (
        <span
          className="text-emerald-400"
          style={{ width: '1em', height: '1em' }}
        >
          <ArrowUpIcon />
        </span>
      ) : counter.calculationConfiguration.type === 'trend' &&
        displayResult.result < 0 ? (
        <span className="text-red-400" style={{ width: '1em', height: '1em' }}>
          <ArrowDownIcon />
        </span>
      ) : (
        counter.calculationConfiguration.type === 'trend' && (
          <span
            className="text-gray-300"
            style={{ width: '1em', height: '1em' }}
          >
            <ArrowsUpDownIcon />
          </span>
        )
      )}
      {displayResult.counter.display &&
        displayResult.counter.display.icon !== null && (
          <span style={{ width: '1em', height: '1em' }}>
            {displayResult.counter.display.icon}
          </span>
        )}
      <span
        className={`${
          counter.calculationConfiguration.type === 'trend'
            ? displayResult.result > 0
              ? 'text-emerald-400'
              : displayResult.result < 0
              ? 'text-red-400'
              : 'text-gray-500 dark:text-gray-300'
            : ''
        }`}
        style={{ width, maxWidth }}
      >
        {getNumberDescription(displayResult.result)}
        {counter.calculationConfiguration.type === 'percentage' ||
        counter.calculationConfiguration.type === 'trend'
          ? '%'
          : null}
      </span>
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
