import React from 'react';
import { CountersConfigurations } from '../../types/customizeBarTypes';
import { MetaData } from '../../types/modals';
import { toLowerKeys } from '../../utils/utils';
import LabelDisplay from './LabelDisplay';

export default function MaxLabelDisplay({
  metadataKey,
  metadata,
  countersConfiguration,
  labelClicked,
  width,
  maxWidth,
}: {
  metadataKey: string;
  metadata: MetaData;
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
  width?: string;
  maxWidth?: string;
}) {
  const lowerKeysMetadata = toLowerKeys(metadata) as MetaData;
  const meta = lowerKeysMetadata[metadataKey.toLowerCase()]?.reduce(
    (prev, current) => (prev.count > current.count ? prev : current)
  );
  if (!meta) return <></>;
  return (
    <LabelDisplay
      metadataKey={metadataKey}
      value={meta.value}
      countersConfiguration={countersConfiguration}
      labelClicked={labelClicked}
      width={width}
      maxWidth={maxWidth}
    />
  );
}
