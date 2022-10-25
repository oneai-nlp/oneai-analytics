import { format, parse } from 'date-fns';
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
      {items.map((item, i) => {
        const item_date = parseDate(item.create_date);
        return (
          <div className="p-2 flex flex-wrap w-full" key={i}>
            <span className="w-9/12 truncate">{item.original_text}</span>
            <div className="w-3/12 flex items-center">
              <div>
                <span
                  data-for="global"
                  data-tip={item_date}
                  style={{ width: '1em', height: '1em' }}
                >
                  {item_date.split(' ').at(0)}
                </span>
              </div>
              <div>
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
          </div>
        );
      })}
    </div>
  );
};

function parseDate(date: string | undefined): string {
  if (!date) return '';

  return format(
    parse(date, 'yyyy-MM-dd HH:mm:ss.SSSSSS', new Date()),
    'dd/MM/yyyy HH:mm'
  );
}
