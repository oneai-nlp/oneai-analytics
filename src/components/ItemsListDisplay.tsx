import React from 'react';
import { FC } from 'react';
import CountersLabelsDisplay from '../common/components/CountersLabelsDisplay';
import { CUSTOM_METADATA_KEY } from '../common/configurations/commonConfigurations';
import { ItemsDisplayComponentProps } from '../common/types/componentsInputs';

export const ItemsListDisplay: FC<ItemsDisplayComponentProps> = ({
  items,
  bgColor,
  textColor,
  counters,
  labels,
  countersConfiguration,
  labelClicked,
}) => {
  return (
    <div style={{ backgroundColor: bgColor, color: textColor }}>
      {items.map((item, i) => (
        <div className="p-2 flex flex-wrap w-full" key={i}>
          <span className="w-9/12 truncate">{item.original_text}</span>
          <div className="w-3/12">
            <CountersLabelsDisplay
              metadata={item.metadata}
              counters={counters.filter(
                (counter) =>
                  counter.metadataKeyValue?.key !== CUSTOM_METADATA_KEY
              )}
              labels={labels}
              countersConfiguration={countersConfiguration}
              labelClicked={labelClicked}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
