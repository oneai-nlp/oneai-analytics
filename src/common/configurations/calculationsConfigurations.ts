import { CalculationConfiguration } from '../types/customizeBarTypes';
import {
  topGroupCalculation,
  topGroupPercentCalculation,
  topValueCalculation,
  topValuePercentCalculation,
  totalSumCalculation,
} from '../utils/countersUtils';

export const totalSumCalculationName = 'Total SUM';
export const topValueCalculationName = 'Top value total sum';
export const topValuePercentCalculationName = 'Top value %';
export const topGroupCalculationName = 'Top group total';
export const topGroupPercentCalculationName = 'Top group %';
export const percentOfAllCalculationName = '% of all';

export const totalSumCalculationConfiguration: CalculationConfiguration = {
  name: totalSumCalculationName,
  hasGroups: false,
  type: 'number',
  calculate: totalSumCalculation,
};
export const topValueCalculationConfiguration: CalculationConfiguration = {
  name: topValueCalculationName,
  hasGroups: false,
  type: 'number',
  calculate: topValueCalculation,
};
export const topValuePercentCalculationConfiguration: CalculationConfiguration =
  {
    name: topValuePercentCalculationName,
    hasGroups: false,
    type: 'percentage',
    calculate: topValuePercentCalculation,
  };
export const topGroupCalculationConfiguration: CalculationConfiguration = {
  name: topGroupCalculationName,
  hasGroups: true,
  type: 'number',
  calculate: topGroupCalculation,
};
export const topGroupPercentCalculationConfiguration: CalculationConfiguration =
  {
    name: topGroupPercentCalculationName,
    hasGroups: true,
    type: 'percentage',
    calculate: topGroupPercentCalculation,
  };
