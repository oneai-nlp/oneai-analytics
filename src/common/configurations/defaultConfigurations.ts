import {
  percentOfAllItemsCalculationConfiguration,
  percentOfItemsCalculationConfiguration,
  percentOfTotalUniqueItemsCalculationConfiguration,
  topGroupCalculationConfiguration,
  topGroupPercentCalculationConfiguration,
  topValueCalculationConfiguration,
  topValuePercentCalculationConfiguration,
  totalSumCalculationConfiguration,
  totalUniqueItemsCalculationConfiguration,
  trendCalculationConfiguration,
} from './calculationsConfigurations';

export const defaultCalculations = [
  totalSumCalculationConfiguration,
  topValueCalculationConfiguration,
  topValuePercentCalculationConfiguration,
  topGroupCalculationConfiguration,
  topGroupPercentCalculationConfiguration,
  percentOfItemsCalculationConfiguration,
  percentOfAllItemsCalculationConfiguration,
  trendCalculationConfiguration,
  percentOfTotalUniqueItemsCalculationConfiguration,
  totalUniqueItemsCalculationConfiguration,
];
