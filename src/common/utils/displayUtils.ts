import {
  CountersConfigurations,
  CounterType,
  MetadataKeyValue,
} from '../types/customizeBarTypes';
import { MetaData, Trend, UniqueItemsStats } from '../types/modals';
import { getMetadataKeyValueGroups, hasMultipleMembers } from './countersUtils';

export const numberFormatter = new Intl.NumberFormat('en-US');

export function getMetadataKeyValueDisplay(metadataKeyValue: MetadataKeyValue) {
  if (!metadataKeyValue.value) return metadataKeyValue.key;
  return `${metadataKeyValue.key}.${metadataKeyValue.value}`;
}

export function getBackgroundColorLayers(
  colorAxis: CounterType[],
  metadata: MetaData,
  trends: Trend[],
  countersConfiguration: CountersConfigurations,
  totalItems: number,
  totalUniqueItemsStats?: UniqueItemsStats,
  uniqueItemsStats?: UniqueItemsStats,
  uniquePropertyName?: string
) {
  return groupCounters(colorAxis, countersConfiguration)
    .map((countersGroup) => {
      const groups = countersGroup.map((counter) =>
        counter.calculationConfiguration.calculate(
          counter.metadataKeyValue,
          metadata,
          trends,
          countersConfiguration,
          totalItems,
          totalUniqueItemsStats,
          uniqueItemsStats,
          uniquePropertyName
        )
      );

      if (!groups.some((group) => group.result && group.result > 0)) return '';
      let backgroundString = '';
      let totalPercentage = 0;
      groups.forEach((group) => {
        backgroundString =
          backgroundString +
          `,${
            group.counter?.display?.color ?? 'rgba(255,0,0,0)'
          } ${totalPercentage}% ${totalPercentage + group.result}%`;
        totalPercentage += group.result;
      });
      backgroundString = `${backgroundString},rgba(255,0,0,0) ${totalPercentage}% ${
        100 - totalPercentage
      }%`;
      return `linear-gradient(90deg${backgroundString})`;
    })
    .filter((str) => str !== '');
}

function groupCounters(
  counters: CounterType[],
  countersConfiguration: CountersConfigurations
) {
  return counters.reduce((groups, counter) => {
    const index = groups.findIndex(
      (group) =>
        group.length > 0 &&
        areCountersCanBeGrouped(counter, group.at(0), countersConfiguration)
    );
    if (index !== -1) {
      groups[index].push(counter);
    } else {
      groups.push([counter]);
    }
    return groups;
  }, [] as Array<CounterType[]>);
}

function areCountersCanBeGrouped(
  firstCounter: CounterType,
  secondCounter: CounterType | undefined,
  countersConfiguration: CountersConfigurations
): boolean {
  if (
    !firstCounter.metadataKeyValue ||
    !secondCounter ||
    !secondCounter.metadataKeyValue
  )
    return false;
  if (
    firstCounter.calculationConfiguration.name !==
    secondCounter.calculationConfiguration.name
  )
    return false;
  return areKeyValuesSameLevel(
    firstCounter.metadataKeyValue,
    secondCounter.metadataKeyValue,
    countersConfiguration
  );
}

function areKeyValuesSameLevel(
  firstKeyValue: MetadataKeyValue,
  secondKeyValue: MetadataKeyValue,
  countersConfiguration: CountersConfigurations
): boolean {
  if (firstKeyValue.key !== secondKeyValue.key) return false;

  const firstKeyValueHasGroups =
    getMetadataKeyValueGroups(firstKeyValue, countersConfiguration).length > 0;
  const secondKeyValueHasGroups =
    getMetadataKeyValueGroups(secondKeyValue, countersConfiguration).length > 0;
  if (firstKeyValueHasGroups !== secondKeyValueHasGroups) return false;

  const firstKeyValueHasMultipleMembers = hasMultipleMembers(
    firstKeyValue,
    countersConfiguration
  );
  const secondKeyValueHasMultipleMembers = hasMultipleMembers(
    secondKeyValue,
    countersConfiguration
  );
  if (firstKeyValueHasMultipleMembers !== secondKeyValueHasMultipleMembers)
    return false;

  return true;
}
