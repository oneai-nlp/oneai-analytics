import {
  CounterConfiguration,
  CountersConfigurations,
  GroupMembers,
  MetadataKeyValue,
} from '../types/customizeBarTypes';
import { MetaData } from '../types/modals';
import { sum, toLowerKeys } from './utils';

export function topGroupPercentCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  countersConfigurations: CountersConfigurations
) {
  const counter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );
  const groups = getCounterGroups(counter);
  if (!counter || groups.length === 0) return { counter: counter, result: 0 };

  const sums = groups.map((group) =>
    calculateSumItemsInMetadata(group.members, [], metadata)
  );
  const max = Math.max(...sums);
  const maxGroup = groups[sums.indexOf(max)];
  const groupsSum = sum(sums);
  return {
    result: groupsSum === 0 ? 0 : Math.round((max / groupsSum) * 100),
    counter: max > 0 ? maxGroup ?? counter : counter,
    metadataKey: maxGroup.label,
    value: undefined,
  };
}

export function groupsPercentsCalculation(
  label: string,
  metadata: MetaData,
  countersConfigurations: CountersConfigurations
): {
  result?: number;
  counter?: CounterConfiguration;
  metadataKey?: string;
  value?: string;
}[] {
  const counter = getMetadataKeyValueConfiguration(
    { key: label },
    countersConfigurations
  );
  const groups = getCounterGroups(counter);
  if (!counter || groups.length === 0) return [];

  const sums = groups.map((group) => {
    return {
      group: group,
      result: calculateSumItemsInMetadata(group.members, [], metadata),
    };
  });
  const groupsSum = sum(sums.map((g) => g.result));
  if (groupsSum === 0) return [];

  return sums.map((groupSum) => {
    return {
      result: Math.round((groupSum.result / groupsSum) * 100),
      counter: groupSum.group ?? counter,
      metadataKey: groupSum.group.label,
      value: undefined,
    };
  });
}

export function topGroupCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  countersConfigurations: CountersConfigurations
) {
  const counter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );
  const groups = getCounterGroups(counter);
  if (groups.length === 0)
    return {
      counter: counter,
      result: 0,
    };
  const sums = groups.map((group) =>
    calculateSumItemsInMetadata(group.members, [], metadata)
  );
  const max = Math.max(...sums);
  const maxGroup = groups[sums.indexOf(max)];
  return {
    result: max,
    counter: max > 0 ? maxGroup ?? counter : counter,
    metadataKey: maxGroup.label,
    value: undefined,
  };
}

export function topValuePercentCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  countersConfigurations: CountersConfigurations
) {
  const counter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );
  if (!counter) return { counter: counter, result: 0 };

  const max = getMaxItemValue(counter.members, counter.items, metadata);
  const sum = calculateSumItemsInMetadata(
    counter.members,
    counter.items,
    metadata
  );

  return {
    result: sum === 0 ? 0 : Math.round((max.count / sum) * 100),
    counter:
      getItemCounterConfiguration(
        max.metadata,
        max.value,
        countersConfigurations
      ) ?? counter,
    metadataKey: max.metadata,
    value: max.value,
  };
}

export function topValueCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  countersConfigurations: CountersConfigurations
) {
  const counter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );
  if (!counter) return { counter: counter, result: 0 };

  const maxItem = getMaxItemValue(counter.members, counter.items, metadata);

  return {
    result: maxItem.count,
    counter:
      getItemCounterConfiguration(
        maxItem.metadata,
        maxItem.value,
        countersConfigurations
      ) ?? counter,
    metadataKey: maxItem.metadata,
    value: maxItem.value,
  };
}

export function totalSumCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  countersConfigurations: CountersConfigurations
): {
  counter: CounterConfiguration | null;
  metadata?: string | undefined;
  value?: string | undefined;
  result: number;
} {
  const counter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );
  if (!counter) return { counter: counter, result: 0 };
  return {
    result: calculateSumItemsInMetadata(
      counter.members,
      counter.items,
      metadata
    ),
    counter: counter,
  };
}

export function getMetadataKeyValueGroups(
  metadataKeyValue: MetadataKeyValue | null,
  countersConfigurations: CountersConfigurations
): CounterConfiguration[] {
  const counter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );

  return getCounterGroups(counter);
}

function getCounterGroups(
  counter: CounterConfiguration | null
): CounterConfiguration[] {
  if (!counter) return [];

  return counter.items?.filter((group) => group.isGroup ?? false) ?? [];
}

export function getMetadataKeyValueConfiguration(
  metadataKeyValue: MetadataKeyValue | null,
  countersConfigurations: CountersConfigurations
): CounterConfiguration | null {
  if (!metadataKeyValue) return null;
  const keyConfig = countersConfigurations[metadataKeyValue.key.toLowerCase()];
  if (!keyConfig) return null;
  if (!metadataKeyValue.value) return keyConfig;
  const memberConfig = keyConfig.items?.find(
    (group) =>
      group.label?.toLowerCase() === metadataKeyValue.value?.toLowerCase()
  );
  if (!memberConfig) return keyConfig;
  return memberConfig;
}

export function calculateSumItemsInMetadata(
  members: GroupMembers[] | undefined,
  groups: CounterConfiguration[] | undefined,
  metadata: MetaData
): number {
  const items = getValuesAndCounts(members, groups, metadata);
  return sum(items.map(({ count }) => count));
}

export function getMaxItemValue(
  members: GroupMembers[] | undefined,
  groups: CounterConfiguration[] | undefined,
  metadata: MetaData
): { metadata?: string; value?: string; count: number } {
  const items = getValuesAndCounts(members, groups, metadata);
  if (items.length === 0) return { count: 0 };

  return items.reduce((prev, current) =>
    prev.count > current.count ? prev : current
  );
}

function getValuesAndCounts(
  members: GroupMembers[] | undefined,
  groups: CounterConfiguration[] | undefined,
  metadata: MetaData
): { metadata?: string; value: string; count: number }[] {
  const lowerKeysMetadata = toLowerKeys(metadata) as MetaData;
  const membersData = filterRelevantValues(members, lowerKeysMetadata);

  if (membersData.length > 0) return membersData;

  return filterRelevantValues(
    groups?.flatMap((group) => group.members ?? []) ?? [],
    lowerKeysMetadata
  );
}

function filterRelevantValues(
  members: GroupMembers[] | undefined,
  metadata: MetaData
): { metadata?: string; value: string; count: number }[] {
  return (
    members?.flatMap((member) => {
      const values = metadata[member.metadataName ?? ''];
      if (!values) return [];

      return (
        member.values === undefined
          ? values
          : values.filter((k) => member.values?.includes(k.value))
      ).map(({ value, count }) => {
        return { metadata: member.metadataName, value: value, count: count };
      });
    }) ?? []
  );
}

export function getItemCounterConfiguration(
  metadata: string | undefined,
  value: string | undefined,
  countersConfigurations: CountersConfigurations
): CounterConfiguration | null {
  if (!metadata || !value) return null;
  const counterConfig = countersConfigurations[metadata];
  return counterConfig.items?.find((group) => group.label === value) ?? null;
}
