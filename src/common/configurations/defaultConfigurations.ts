import {
  percentOfAllItemsCalculationConfiguration,
  percentOfItemsCalculationConfiguration,
  topGroupCalculationConfiguration,
  topGroupPercentCalculationConfiguration,
  topValueCalculationConfiguration,
  topValuePercentCalculationConfiguration,
  totalSumCalculationConfiguration,
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
];
