import React from 'react';
import {
  CountersConfigurations,
  CounterType,
} from '../types/customizeBarTypes';
import { MetaData } from '../types/modals';
import CounterDisplay from './CountersLabels/CounterDisplay';
import MaxLabelDisplay from './CountersLabels/MaxLabelDisplay';

export default function CountersLabelsDisplay({
  counters,
  labels,
  metadata,
  countersConfiguration,
  labelClicked,
  counterWidth,
  counterMaxWidth,
  labelWidth,
  labelMaxWidth,
}: {
  counters: CounterType[];
  labels: string[];
  metadata: MetaData;
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
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
          <div key={i} className="ml-1">
            <CounterDisplay
              counter={counter}
              countersConfiguration={countersConfiguration}
              metadata={metadata}
              width={counterWidth}
              maxWidth={counterMaxWidth}
            />
          </div>
        ))}
      {labels.map((label, i) => (
        <MaxLabelDisplay
          key={i}
          countersConfiguration={countersConfiguration}
          metadataKey={label}
          labelClicked={labelClicked}
          metadata={metadata}
          width={labelWidth}
          maxWidth={labelMaxWidth}
        />
      ))}
    </span>
  );
}
