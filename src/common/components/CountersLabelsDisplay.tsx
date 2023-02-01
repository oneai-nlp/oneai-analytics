import React from 'react';
import {
  CountersConfigurations,
  CounterType,
} from '../types/customizeBarTypes';
import { MetaData, Trend } from '../types/modals';
import CounterDisplay from './CountersLabels/CounterDisplay';
import MaxLabelDisplay from './CountersLabels/MaxLabelDisplay';

export default function CountersLabelsDisplay({
  counters,
  labels,
  metadata,
  countersConfiguration,
  trends,
  labelClicked,
  counterWidth,
  counterMaxWidth,
  labelWidth,
  labelMaxWidth,
  totalItems,
}: {
  counters: CounterType[];
  labels: string[];
  metadata: MetaData;
  countersConfiguration: CountersConfigurations;
  trends: Trend[];
  labelClicked: (key: string, value: string) => void;
  totalItems: number;
  counterWidth?: string;
  counterMaxWidth?: string;
  labelWidth?: string;
  labelMaxWidth?: string;
}) {
  return (
    <span className="truncate flex items-center">
      {counters
        .filter((counter) => counter.metadataKeyValue !== null)
        .map((counter, i) => (
          <div key={i} className="mr-2">
            <CounterDisplay
              counter={counter}
              countersConfiguration={countersConfiguration}
              metadata={metadata}
              trends={trends}
              width={counterWidth}
              maxWidth={counterMaxWidth}
              totalItems={totalItems}
            />
          </div>
        ))}
      {labels.map((label, i) => (
        <div key={i} className="mr-1">
          <MaxLabelDisplay
            countersConfiguration={countersConfiguration}
            metadataKey={label}
            labelClicked={labelClicked}
            metadata={metadata}
            width={labelWidth}
            maxWidth={labelMaxWidth}
          />
        </div>
      ))}
    </span>
  );
}
