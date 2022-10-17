import {
  CounterConfiguration,
  CounterType,
  GroupMembers,
} from '../types/CustomizeBarTypes';
import { MetaData } from '../types/modals';
import { sum } from './utils';

export function calculateCounter(
  counter: CounterType,
  metadata: MetaData
): { counter: CounterType | null; result: number } {
  if (!counter.counterConfiguration)
    return { counter: counter.counterConfiguration, result: 0 };
  if (counter.counterType.name === 'count') {
    return {
      result: calculateSumItemsInMetadata(
        counter.counterConfiguration.members,
        counter.counterConfiguration.groups,
        metadata
      ),
      counter: counter,
    };
  }

  if (counter.counterType.name === 'top value') {
    return {
      result: getMaxItemValue(
        counter.counterConfiguration.members,
        counter.counterConfiguration.groups,
        metadata
      ).count,
      counter: counter,
    };
  }

  if (counter.counterType.name === 'top value %') {
    const max = getMaxItemValue(
      counter.counterConfiguration.members,
      counter.counterConfiguration.groups,
      metadata
    ).count;
    const sum = calculateSumItemsInMetadata(
      counter.counterConfiguration.members,
      counter.counterConfiguration.groups,
      metadata
    );

    return {
      result: sum === 0 ? 0 : Math.round((max / sum) * 100),
      counter: counter,
    };
  }

  // TODO delete
  return {
    result: calculateSumItemsInMetadata(
      counter.counterConfiguration.members,
      counter.counterConfiguration.groups,
      metadata
    ),
    counter: counter,
  };
}

export function getCounterGroups(
  counter: CounterConfiguration
): CounterConfiguration[] {
  return (
    counter.groups?.filter((group) => {
      let membersCount = 0;
      group.members?.forEach((member) => {
        if (member.values === undefined) {
          membersCount += 2;
        } else {
          membersCount += member.values.length;
        }
      });

      return membersCount > 1;
    }) ?? []
  );
}

function calculateSumItemsInMetadata(
  members: GroupMembers[] | undefined,
  groups: CounterConfiguration[] | undefined,
  metadata: MetaData
): number {
  const items = getValuesAndCounts(members, groups, metadata);
  return sum(items.map(({ count }) => count));
}

function getMaxItemValue(
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
  const membersData = filterRelevantValues(members, metadata);

  if (membersData.length > 0) return membersData;

  return filterRelevantValues(
    groups?.flatMap((group) => group.members ?? []) ?? [],
    metadata
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
