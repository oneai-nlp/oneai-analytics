import { CUSTOM_METADATA_KEY } from '../configurations/commonConfigurations';
import {
  CounterConfiguration,
  CountersConfigurations,
  GroupMembers,
  MetadataKeyValue,
} from '../types/customizeBarTypes';
import { MetaData, Trend, UniqueItemsStats } from '../types/modals';
import {
  objectToLowerCase,
  percentageIncrease,
  sum,
  toLowerKeys,
} from './utils';

export function topGroupPercentCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  _: Trend[],
  countersConfigurations: CountersConfigurations,
  __: number
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
    result: groupsSum === 0 ? 0 : (max / groupsSum) * 100,
    counter: max > 0 ? maxGroup ?? counter : counter,
    metadataKey: maxGroup.label,
    value: undefined,
  };
}

export function groupsPercentsCalculation(
  label: string,
  metadata: MetaData,
  _: Trend[],
  countersConfigurations: CountersConfigurations,
  __: number
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
      result: (groupSum.result / groupsSum) * 100,
      counter: groupSum.group ?? counter,
      metadataKey: groupSum.group.label,
      value: undefined,
    };
  });
}

export function topGroupCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  _: Trend[],
  countersConfigurations: CountersConfigurations,
  __: number
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
  _: Trend[],
  countersConfigurations: CountersConfigurations,
  __: number
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
    result: sum === 0 ? 0 : (max.count / sum) * 100,
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
  _: Trend[],
  countersConfigurations: CountersConfigurations,
  __: number
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
  _: Trend[],
  countersConfigurations: CountersConfigurations,
  __: number
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

export function percentOfItemsCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  _: Trend[],
  countersConfigurations: CountersConfigurations,
  __: number
) {
  if (!metadataKeyValue) return { counter: null, result: 0 };
  const itemCounter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );

  const keyCounter = getMetadataKeyValueConfiguration(
    { key: metadataKeyValue.key },
    countersConfigurations
  );

  if (!itemCounter || !keyCounter) return { counter: null, result: 0 };

  const itemCount = calculateSumItemsInMetadata(
    itemCounter.members,
    itemCounter.items,
    metadata
  );

  const keyCount = calculateSumItemsInMetadata(
    keyCounter.members,
    keyCounter.items,
    metadata
  );

  return {
    result: keyCount === 0 ? 0 : (itemCount / keyCount) * 100,
    counter: itemCounter ?? keyCounter,
    metadataKey: metadataKeyValue.key,
    value: metadataKeyValue.value,
  };
}

export function percentOfAllItemsCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  _: Trend[],
  countersConfigurations: CountersConfigurations,
  totalItems: number
) {
  if (!metadataKeyValue) return { counter: null, result: 0 };
  const itemCounter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );

  const keyCounter = getMetadataKeyValueConfiguration(
    { key: CUSTOM_METADATA_KEY },
    countersConfigurations
  );

  if (!itemCounter || !keyCounter) return { counter: null, result: 0 };

  const itemCount = calculateSumItemsInMetadata(
    itemCounter.members,
    itemCounter.items,
    metadata
  );

  const keyCount = calculateSumItemsInMetadata(
    keyCounter.members,
    keyCounter.items,
    metadata
  );

  let result;
  if (metadataKeyValue.key === CUSTOM_METADATA_KEY) {
    result = totalItems === 0 ? 0 : (itemCount / totalItems) * 100;
  } else {
    result = keyCount === 0 ? 0 : (itemCount / keyCount) * 100;
  }
  return {
    result: result,
    counter: itemCounter ?? keyCounter,
    metadataKey: metadataKeyValue.key,
    value: metadataKeyValue.value,
  };
}

export function trendCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  _: MetaData,
  trends: Trend[],
  countersConfigurations: CountersConfigurations
) {
  if (!metadataKeyValue || trends.length < 2)
    return { counter: null, result: 0 };
  const itemCounter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );

  const keyCounter = getMetadataKeyValueConfiguration(
    { key: metadataKeyValue.key },
    countersConfigurations
  );

  if (!itemCounter || !keyCounter) return { counter: null, result: 0 };

  const trendsCounts = trends.map((trend) =>
    calculateSumItemsInMetadata(
      itemCounter.members,
      itemCounter.items,
      trend.metadata
    )
  );
  const latestTrend = trendsCounts.at(0) ?? 0;
  const previousTrendsSum = sum(trendsCounts.slice(1, trendsCounts.length));
  const previousTrendsMean =
    previousTrendsSum > 0 ? previousTrendsSum / trendsCounts.length - 1 : 0;
  const trend = percentageIncrease(previousTrendsMean, latestTrend);

  return {
    result: trend,
    counter: itemCounter ?? keyCounter,
    metadataKey: metadataKeyValue.key,
    value: metadataKeyValue.value,
  };
}

export function percentOfAllUniqueItemsCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  trend: Trend[],
  countersConfigurations: CountersConfigurations,
  totalItems: number,
  totalUniqueItemsStats?: UniqueItemsStats,
  _?: UniqueItemsStats,
  uniquePropertyName?: string
) {
  if (!uniquePropertyName)
    return percentOfAllItemsCalculation(
      metadataKeyValue,
      metadata,
      trend,
      countersConfigurations,
      totalItems
    );

  if (!metadataKeyValue || !totalUniqueItemsStats || !uniquePropertyName)
    return { counter: null, result: 0 };
  const itemCounter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );

  if (!itemCounter) return { counter: null, result: 0 };

  const itemCount = calculateSumItemsInMetadata(
    itemCounter.members,
    itemCounter.items,
    metadata
  );

  const keyCount =
    totalUniqueItemsStats.unique_values_count.find(
      (uv) => uv.meta_key === uniquePropertyName
    )?.unique_values_count ?? 0;

  const result = keyCount === 0 ? 0 : (itemCount / keyCount) * 100;

  return {
    result: result,
    counter: itemCounter,
    metadataKey: metadataKeyValue.key,
    value: metadataKeyValue.value,
  };
}

export function totalUniqueItemsCalculation(
  metadataKeyValue: MetadataKeyValue | null,
  metadata: MetaData,
  trend: Trend[],
  countersConfigurations: CountersConfigurations,
  totalItems: number,
  _?: UniqueItemsStats,
  uniqueItemsStats?: UniqueItemsStats,
  uniquePropertyName?: string
) {
  if (!uniquePropertyName)
    return totalSumCalculation(
      metadataKeyValue,
      metadata,
      trend,
      countersConfigurations,
      totalItems
    );

  if (!metadataKeyValue || !uniqueItemsStats)
    return { counter: null, result: 0 };

  let itemCounter;

  if (metadataKeyValue.key === CUSTOM_METADATA_KEY) {
    itemCounter = getMetadataKeyValueConfiguration(
      { key: uniquePropertyName },
      countersConfigurations
    );
  } else {
    itemCounter = getMetadataKeyValueConfiguration(
      metadataKeyValue,
      countersConfigurations
    );
  }

  if (!itemCounter) return { counter: null, result: 0 };

  const keyCount =
    uniqueItemsStats.unique_values_count.find(
      (uv) =>
        uv.meta_key ===
        (metadataKeyValue.key === CUSTOM_METADATA_KEY
          ? uniquePropertyName
          : metadataKeyValue.key)
    )?.unique_values_count ?? 0;

  return {
    result: keyCount,
    counter: itemCounter,
    metadataKey: metadataKeyValue.key,
    value: metadataKeyValue.value,
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

export function hasMultipleMembers(
  metadataKeyValue: MetadataKeyValue | null,
  countersConfigurations: CountersConfigurations
): boolean {
  const counter = getMetadataKeyValueConfiguration(
    metadataKeyValue,
    countersConfigurations
  );
  if (!counter) return false;
  if (counter.isGroup) return true;
  let sum = 0;
  counter.members?.forEach((member) => (sum += member.values?.length ?? 2));
  return sum > 1;
}

export function getMetadataKeyValueConfiguration(
  metadataKeyValue: MetadataKeyValue | null,
  countersConfigurations: CountersConfigurations
): CounterConfiguration | null {
  if (!metadataKeyValue) return null;
  const keyConfig = objectToLowerCase(countersConfigurations)[
    metadataKeyValue.key.toLowerCase()
  ];
  if (!keyConfig) return null;
  if (!metadataKeyValue.value) return keyConfig;
  const memberConfig = keyConfig.items?.find(
    (group) =>
      group.label?.toLowerCase() === metadataKeyValue.value?.toLowerCase()
  );
  if (!memberConfig || !memberConfig.display) return keyConfig;
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
  const valueCounterConfig = counterConfig.items?.find(
    (group) => group.label === value
  );
  if (!valueCounterConfig || !valueCounterConfig.display) return null;
  return valueCounterConfig;
}
