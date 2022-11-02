import React from 'react';
import { CountersConfigurations } from '../../types/customizeBarTypes';
import { getMetadataKeyValueConfiguration } from '../../utils/countersUtils';

export default function LabelDisplay({
  metadataKey,
  value,
  countersConfiguration,
  labelClicked,
  tooltip = '',
  width,
  maxWidth = '20ch',
}: {
  metadataKey: string;
  value: string;
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
  tooltip?: string;
  width?: string;
  maxWidth?: string;
}) {
  const config = getMetadataKeyValueConfiguration(
    { key: metadataKey, value: value },
    countersConfiguration
  );

  return (
    <span
      data-for="global"
      data-tip={tooltip}
      className="flex items-center text-sm text-white p-1 cursor-pointer hover:text-gray-300"
      onClick={() => labelClicked(metadataKey, value)}
    >
      {config && config.display && config.display.icon !== null && (
        <span style={{ width: '1em', height: '1em', marginRight: '1px' }}>
          {config.display.icon}
        </span>
      )}
      <span style={{ width, maxWidth }} className="truncate">
        {value}
      </span>
    </span>
  );
}
