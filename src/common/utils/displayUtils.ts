import {
  CountersConfigurations,
  CounterType,
  MetadataKeyValue,
} from '../types/customizeBarTypes';
import { MetaData } from '../types/modals';
import { getMetadataKeyValueGroups, hasMultipleMembers } from './countersUtils';

export function getMetadataKeyValueDisplay(metadataKeyValue: MetadataKeyValue) {
  if (!metadataKeyValue.value) return metadataKeyValue.key;
  return `${metadataKeyValue.key}.${metadataKeyValue.value}`;
}

export function getBackgroundColorLayers(
  colorAxis: CounterType[],
  metadata: MetaData,
  countersConfiguration: CountersConfigurations
) {
  return groupCounters(colorAxis, countersConfiguration)
    .map((countersGroup) => {
      console.log(countersGroup);
      const groups = countersGroup
        .map((counter) =>
          counter.calculationConfiguration.calculate(
            counter.metadataKeyValue,
            metadata,
            countersConfiguration
          )
        )
        .sort((group1, group2) => (group2.result ?? 0) - (group1.result ?? 0));
      if (!groups.some((group) => group.result && group.result > 0)) return '';
      let backgroundString = '';
      groups.forEach(
        (group) =>
          (backgroundString =
            backgroundString +
            `,${group.counter?.display?.color ?? '#D3D3D3'} ${group.result}%`)
      );
      backgroundString = backgroundString + ',rgba(255,0,0,0)';
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
