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
  translate,
  chatLogEnabled,
  totalItems,
}) => {
  return (
    <div
      className="overflow-x-auto text-black bg-[#F7F7F7] dark:bg-[#272535] dark:text-white"
      style={{ backgroundColor: bgColor, color: textColor }}
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
            const item_date = parseDate(item.item_timestamp);

            const onClickRow = () => {
              if (chatLogEnabled) {
                try {
                  window.postMessage(
                    {
                      event: 'OPEN_CHAT_LOG',
                      payload: {
                        item,
                      },
                    },
                    '*'
                  );
                } catch (e) {}
              }
            };

            return (
              <tr
                key={i}
                role={chatLogEnabled ? 'button' : undefined}
                onClick={chatLogEnabled ? onClickRow : undefined}
                className={
                  chatLogEnabled
                    ? 'hover:bg-slate-500 dark:hover:bg-slate-800 cursor-pointer'
                    : ''
                }
              >
                <td className="max-w-[60ch] truncate p-1">
                  {translate &&
                  item.item_translated_text !== undefined &&
                  item.item_translated_text !== null &&
                  item.item_translated_text !== ''
                    ? item.item_translated_text
                    : item.original_text}
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
                        totalItems={totalItems}
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
