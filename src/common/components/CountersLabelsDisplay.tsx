import React from 'react';
import { CounterType } from '../types/Customize';
import { MetaData } from '../types/modals';

export default function CountersLabelsDisplay({
  counters,
  labels,
  metadata,
}: {
  counters: CounterType[];
  labels: string[];
  metadata: MetaData;
}) {
  return (
    <span className="truncate w-full flex">
      {counters
        .filter((counter) => counter.counterConfiguration !== null)
        .map((counter, i) => {
          const counterConfig = counter.counterConfiguration;
          if (!counterConfig) return <></>;
          const count = counterConfig.members?.map((member) => {
            const key = metadata[member.metadataName ?? ''];
            if (!key) return 0;
            let itemCounts: number[] = [];
            if (member.values === undefined) {
              itemCounts = key.map(({ count }) => count);
            } else {
              itemCounts = key
                .filter((k) => member.values?.includes(k.value))
                .map(({ count }) => count);
            }

            return itemCounts.reduce((partialSum, a) => partialSum + a, 0);
          }) ?? [0];

          return (
            <span
              key={i}
              className={`ml-1 flex items-center ${
                counterConfig.display
                  ? counterConfig.display.color === 'green'
                    ? 'text-emerald-400'
                    : counterConfig.display.color === 'red'
                    ? 'text-red-400'
                    : 'text-white'
                  : 'text-white'
              }`}
            >
              {counterConfig.display && counterConfig.display.icon !== null && (
                <>{counterConfig.display.icon}</>
              )}
              {count.reduce((partialSum, a) => partialSum + a, 0)}
            </span>
          );
        })}
      {labels.map((label, i) => {
        const meta = metadata[label]?.reduce((prev, current) =>
          prev.count > current.count ? prev : current
        );
        if (!meta) return <></>;
        return (
          <span key={i} className="ml-1 bg-slate-400 rounded-xl p-1">
            {meta.value ?? ''}
          </span>
        );
      })}
    </span>
  );
}
