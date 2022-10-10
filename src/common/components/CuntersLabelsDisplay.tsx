import React from 'react';
import { CUSTOM_METADATA_KEY } from '../types/configurations';
import { MetaData } from '../types/modals';

export default function CountersLabelsDisplay({
  counters,
  labels,
  metadata,
}: {
  counters: string[];
  labels: string[];
  metadata: MetaData;
}) {
  return (
    <span className="truncate w-full">
      {counters.map((counter) => {
        const meta = metadata[counter];
        return (
          <span
            className={`ml-1 ${
              counter === CUSTOM_METADATA_KEY
                ? 'text-white'
                : 'text-emerald-400'
            }`}
          >
            {meta && meta.length > 0
              ? meta
                  .map((instance) => instance.count)
                  .reduce((partialSum, a) => partialSum + a, 0)
              : 0}
          </span>
        );
      })}
      {labels.map((label) => {
        const meta = metadata[label]?.reduce((prev, current) =>
          prev.count > current.count ? prev : current
        );
        if (!meta) return <></>;
        return (
          <span className="ml-1 bg-slate-400 rounded-xl p-1">
            {meta.value ?? ''}
          </span>
        );
      })}
    </span>
  );
}
