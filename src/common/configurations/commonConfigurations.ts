import {
  topGroupCalculationConfiguration,
  topGroupPercentCalculationConfiguration,
  topValueCalculationConfiguration,
  topValuePercentCalculationConfiguration,
  totalSumCalculationConfiguration,
} from './calculationsConfigurations';

export const CUSTOM_METADATA_KEY = 'item count';
export const countersStorageKey = 'oneAi-counters';
export const labelsStorageKey = 'oneAi-labels';
export const defaultCalculations = [
  totalSumCalculationConfiguration,
  topValueCalculationConfiguration,
  topValuePercentCalculationConfiguration,
  topGroupCalculationConfiguration,
  topGroupPercentCalculationConfiguration,
];
