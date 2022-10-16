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
        metadata
      ),
      counter: counter,
    };
  }

  if (counter.counterType.name === 'top value') {
    return {
      result: getMaxItemValue(counter.counterConfiguration.members, metadata)
        .result,
      counter: counter,
    };
  }

  if (counter.counterType.name === 'top value %') {
    const max = getMaxItemValue(
      counter.counterConfiguration.members,
      metadata
    ).result;
    const sum = calculateSumItemsInMetadata(
      counter.counterConfiguration.members,
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
  metadata: MetaData
): number {
  const count = members?.map((member) => {
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

    return sum(itemCounts);
  }) ?? [0];

  return sum(count);
}

function getMaxItemValue(
  members: GroupMembers[] | undefined,
  metadata: MetaData
): { metadata?: string; value?: string; result: number } {
  const itemCounts: { metadata?: string; value?: string; result: number }[] =
    members?.flatMap((member) => {
      const values = metadata[member.metadataName ?? ''];
      if (!values) return [{ metadata: member.metadataName, result: 0 }];
      if (member.values === undefined) {
        return values.map(({ count, value }) => {
          return { metadata: member.metadataName, value: value, result: count };
        });
      }
      return values
        .filter((k) => member.values?.includes(k.value))
        .map(({ count, value }) => {
          return { metadata: member.metadataName, value: value, result: count };
        });
    }) ?? [{ result: 0 }];

  if (!itemCounts || itemCounts.length === 0) return { result: 0 };

  return itemCounts.reduce((prev, current) =>
    prev.result > current.result ? prev : current
  );
}
