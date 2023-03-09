import { CountersConfigurations, CounterType, MetadataKeyValue } from '../types/customizeBarTypes';
import { MetaData, Trend } from '../types/modals';
export declare const numberFormatter: Intl.NumberFormat;
export declare function getMetadataKeyValueDisplay(metadataKeyValue: MetadataKeyValue): string;
export declare function getBackgroundColorLayers(colorAxis: CounterType[], metadata: MetaData, trends: Trend[], countersConfiguration: CountersConfigurations, totalItems: number): string[];
