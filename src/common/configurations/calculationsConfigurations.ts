import { CalculationConfiguration } from '../types/customizeBarTypes';
import {
  percentOfAllItemsCalculation,
  percentOfAllUniqueItemsCalculation,
  percentOfItemsCalculation,
  topGroupCalculation,
  topGroupPercentCalculation,
  topValueCalculation,
  topValuePercentCalculation,
  totalSumCalculation,
  totalUniqueItemsCalculation,
  trendCalculation,
} from '../utils/countersUtils';

export const totalSumCalculationName = 'Total SUM';
export const topValueCalculationName = 'Top value total sum';
export const topValuePercentCalculationName = 'Top value %';
export const topGroupCalculationName = 'Top group total';
export const topGroupPercentCalculationName = 'Top group %';
export const percentOfItemsCalculationName = '% of items';
export const percentOfAllCalculationName = '% of all items';
export const trendCalculationName = 'trend';
export const percentOfTotalUniqueItemsCalculationName = '% of all unique items';
export const totalUniqueItemsCalculationName = 'Total unique items';

export const totalSumCalculationConfiguration: CalculationConfiguration = {
  name: totalSumCalculationName,
  hasGroups: false,
  hasMultipleMembers: false,
  type: 'number',
  calculate: totalSumCalculation,
};

export const topValueCalculationConfiguration: CalculationConfiguration = {
  name: topValueCalculationName,
  hasGroups: false,
  hasMultipleMembers: true,
  type: 'number',
  calculate: topValueCalculation,
};

export const topValuePercentCalculationConfiguration: CalculationConfiguration =
  {
    name: topValuePercentCalculationName,
    hasGroups: false,
    hasMultipleMembers: true,
    type: 'percentage',
    calculate: topValuePercentCalculation,
  };

export const topGroupCalculationConfiguration: CalculationConfiguration = {
  name: topGroupCalculationName,
  hasGroups: true,
  hasMultipleMembers: false,
  type: 'number',
  calculate: topGroupCalculation,
};

export const topGroupPercentCalculationConfiguration: CalculationConfiguration =
  {
    name: topGroupPercentCalculationName,
    hasGroups: true,
    hasMultipleMembers: false,
    type: 'percentage',
    calculate: topGroupPercentCalculation,
  };

export const percentOfItemsCalculationConfiguration: CalculationConfiguration =
  {
    name: percentOfItemsCalculationName,
    hasGroups: false,
    hasMultipleMembers: false,
    type: 'percentage',
    calculate: percentOfItemsCalculation,
  };

export const percentOfAllItemsCalculationConfiguration: CalculationConfiguration =
  {
    name: percentOfAllCalculationName,
    hasGroups: false,
    hasMultipleMembers: false,
    type: 'percentage',
    calculate: percentOfAllItemsCalculation,
  };

export const trendCalculationConfiguration: CalculationConfiguration = {
  name: trendCalculationName,
  hasGroups: false,
  hasMultipleMembers: false,
  type: 'trend',
  calculate: trendCalculation,
};

export const percentOfTotalUniqueItemsCalculationConfiguration: CalculationConfiguration =
  {
    name: percentOfTotalUniqueItemsCalculationName,
    hasGroups: false,
    hasMultipleMembers: false,
    type: 'percentage',
    calculate: percentOfAllUniqueItemsCalculation,
  };

export const totalUniqueItemsCalculationConfiguration: CalculationConfiguration =
  {
    name: totalUniqueItemsCalculationName,
    hasGroups: false,
    hasMultipleMembers: false,
    type: 'number',
    calculate: totalUniqueItemsCalculation,
  };
