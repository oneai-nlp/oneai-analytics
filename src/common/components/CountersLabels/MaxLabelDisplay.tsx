import React from 'react';
import { CountersConfigurations } from '../../types/customizeBarTypes';
import { MetaData } from '../../types/modals';
import LabelDisplay from './LabelDisplay';

export default function MaxLabelDisplay({
  metadataKey,
  metadata,
  countersConfiguration,
  labelClicked,
}: {
  metadataKey: string;
  metadata: MetaData;
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
}) {
  const meta = metadata[metadataKey]?.reduce((prev, current) =>
    prev.count > current.count ? prev : current
  );
  if (!meta) return <></>;
  return (
    <LabelDisplay
      metadataKey={metadataKey}
      value={meta.value}
      countersConfiguration={countersConfiguration}
      labelClicked={labelClicked}
    />
  );
}
