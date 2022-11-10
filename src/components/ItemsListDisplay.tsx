import { format, parse } from 'date-fns';
import React, { FC } from 'react';
import CounterDisplay from '../common/components/CountersLabels/CounterDisplay';
import MaxLabelDisplay from '../common/components/CountersLabels/MaxLabelDisplay';
import { CUSTOM_METADATA_KEY } from '../common/configurations/commonConfigurations';
import { ItemsDisplayComponentProps } from '../common/types/componentsInputs';
import { getMetadataKeyValueDisplay } from '../common/utils/displayUtils';

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
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className="overflow-x-auto"
    >
      <table className="table-auto w-full h-full text-left">
        <thead className="border-b-2 border-b-slate-500">
          <tr>
            <th className="p-1">Items</th>
            <th className="p-1">Time</th>
            {counters
              .filter(
                (counter) =>
                  counter.metadataKeyValue?.key !== CUSTOM_METADATA_KEY
              )
              .map((counter, i) => (
                <th className="p-1 lowercase first-letter:uppercase" key={i}>
                  {counter.metadataKeyValue
                    ? getMetadataKeyValueDisplay(counter.metadataKeyValue)
                    : ''}
                </th>
              ))}
            {labels.map((label, i) => (
              <th className="p-1 lowercase first-letter:uppercase" key={i}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const item_date = parseDate(item.create_date);
            return (
              <tr key={i}>
                <td className="max-w-[60ch] truncate p-1">
                  {item.original_text}
                </td>
                <td
                  className="p-1"
                  data-for="global"
                  data-tip={item_date}
                  style={{ width: '1em', height: '1em' }}
                >
                  {item_date.split(' ').at(0)}
                </td>
                {counters
                  .filter(
                    (counter) =>
                      counter.metadataKeyValue?.key !== CUSTOM_METADATA_KEY
                  )
                  .map((counter, i) => (
                    <td key={i} className="p-1">
                      <CounterDisplay
                        counter={counter}
                        countersConfiguration={countersConfiguration}
                        metadata={item.metadata}
                        trends={[]}
                      />
                    </td>
                  ))}
                {labels.map((label, i) => (
                  <td key={i}>
                    <MaxLabelDisplay
                      metadataKey={label}
                      labelClicked={labelClicked}
                      countersConfiguration={countersConfiguration}
                      metadata={item.metadata}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
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
