import { ReactElement } from 'react';

export interface CounterType {
  counterConfiguration: CounterConfiguration | null;
  counterType: CalculationType;
}

export interface CountersConfiguration {
  [key: string]: CounterConfiguration;
}

export interface CounterConfiguration {
  label?: string;
  display?: DisplayConfig;
  members?: GroupMembers[];
  groups?: CounterConfiguration[];
  default?: CalculationName[];
}

export interface GroupMembers {
  metadataName?: string;
  values?: string[];
}

export interface DisplayConfig {
  color: 'green' | 'red' | 'white';
  icon: ReactElement | null;
}

export interface CalculationType {
  name: CalculationName;
  type: 'number' | 'percentage';
  hasGroups: boolean;
}

export type CalculationName =
  | 'Total SUM'
  | 'Top value total sum'
  | 'top value %'
  | 'top group total'
  | 'top group %';
