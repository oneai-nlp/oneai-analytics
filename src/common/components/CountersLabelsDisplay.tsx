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
          <MaxLabelDisplay
            countersConfiguration={countersConfiguration}
            metadataKey={label}
            labelClicked={labelClicked}
            metadata={metadata}
          />
        </div>
      ))}
    </span>
  );
}
