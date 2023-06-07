import { ReactElement } from 'react';
import { MetaData, Trend, UniqueItemsStats } from './modals';

export interface CounterType {
  metadataKeyValue: MetadataKeyValue | null;
  calculationConfiguration: CalculationConfiguration;
}

export interface CountersConfigurations {
  [key: string]: CounterConfiguration;
}

export interface CounterConfiguration {
  label?: string;
  display?: DisplayConfig;
  members?: GroupMembers[];
  items?: CounterConfiguration[];
  isGroup?: boolean;
}

export interface GroupMembers {
  metadataName?: string;
  values?: string[];
}

export interface DisplayConfig {
  color: 'green' | 'red' | 'white';
  icon: ReactElement | null;
}
export interface CalculationConfiguration {
  name: string;
  type: 'number' | 'percentage' | 'trend';
  hasGroups: boolean;
  hasMultipleMembers: boolean;
  calculate: (
    selectedMetadataKeyValue: MetadataKeyValue | null,
    metadata: MetaData,
    trends: Trend[],
    allCountersConfigurations: CountersConfigurations,
    allItemsCount: number,
    totalUniqueItemsStats?: UniqueItemsStats,
    uniqueItemsStats?: UniqueItemsStats,
    uniquePropertyName?: string
  ) => {
    counter: CounterConfiguration | null;
    metadataKey?: string;
    value?: string;
    result: number;
  };
}

export interface MetadataKeyValue {
  key: string;
  value?: string;
}

export interface CountersLocalStorageObject {
  metadataKeyValue: MetadataKeyValue | null;
  calculationName: string;
}
