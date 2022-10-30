import React from 'react';
import { CountersConfigurations } from '../../types/customizeBarTypes';
import { getMetadataKeyValueConfiguration } from '../../utils/countersUtils';

export default function LabelDisplay({
  metadataKey,
  value,
  countersConfiguration,
  labelClicked,
  tooltip = '',
}: {
  metadataKey: string;
  value: string;
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
  tooltip?: string;
}) {
  const config = getMetadataKeyValueConfiguration(
    { key: metadataKey, value: value },
    countersConfiguration
  );

  return (
    <span
      data-for="global"
      data-tip={tooltip}
      className="flex items-center text-sm text-gray-500 p-1 cursor-pointer hover:text-gray-300"
      onClick={() => labelClicked(metadataKey, value)}
    >
      {config && config.display && config.display.icon !== null && (
        <span style={{ width: '1em', height: '1em', marginRight: '1px' }}>
          {config.display.icon}
        </span>
      )}
      <span className="max-w-[20ch] truncate">{value}</span>
    </span>
  );
}
