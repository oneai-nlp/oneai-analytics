import { CounterConfiguration, CountersConfigurations, GroupMembers, MetadataKeyValue } from '../types/customizeBarTypes';
import { MetaData, Trend } from '../types/modals';
export declare function topGroupPercentCalculation(metadataKeyValue: MetadataKeyValue | null, metadata: MetaData, _: Trend[], countersConfigurations: CountersConfigurations, __: number): {
    counter: CounterConfiguration | null;
    result: number;
    metadataKey?: undefined;
    value?: undefined;
} | {
    result: number;
    counter: CounterConfiguration;
    metadataKey: string | undefined;
    value: undefined;
};
export declare function groupsPercentsCalculation(label: string, metadata: MetaData, _: Trend[], countersConfigurations: CountersConfigurations, __: number): {
    result?: number;
    counter?: CounterConfiguration;
    metadataKey?: string;
    value?: string;
}[];
export declare function topGroupCalculation(metadataKeyValue: MetadataKeyValue | null, metadata: MetaData, _: Trend[], countersConfigurations: CountersConfigurations, __: number): {
    counter: CounterConfiguration | null;
    result: number;
    metadataKey?: undefined;
    value?: undefined;
} | {
    result: number;
    counter: CounterConfiguration | null;
    metadataKey: string | undefined;
    value: undefined;
};
export declare function topValuePercentCalculation(metadataKeyValue: MetadataKeyValue | null, metadata: MetaData, _: Trend[], countersConfigurations: CountersConfigurations, __: number): {
    counter: null;
    result: number;
    metadataKey?: undefined;
    value?: undefined;
} | {
    result: number;
    counter: CounterConfiguration;
    metadataKey: string | undefined;
    value: string | undefined;
};
export declare function topValueCalculation(metadataKeyValue: MetadataKeyValue | null, metadata: MetaData, _: Trend[], countersConfigurations: CountersConfigurations, __: number): {
    counter: null;
    result: number;
    metadataKey?: undefined;
    value?: undefined;
} | {
    result: number;
    counter: CounterConfiguration;
    metadataKey: string | undefined;
    value: string | undefined;
};
export declare function totalSumCalculation(metadataKeyValue: MetadataKeyValue | null, metadata: MetaData, _: Trend[], countersConfigurations: CountersConfigurations, __: number): {
    counter: CounterConfiguration | null;
    metadata?: string | undefined;
    value?: string | undefined;
    result: number;
};
export declare function percentOfItemsCalculation(metadataKeyValue: MetadataKeyValue | null, metadata: MetaData, _: Trend[], countersConfigurations: CountersConfigurations, __: number): {
    counter: null;
    result: number;
    metadataKey?: undefined;
    value?: undefined;
} | {
    result: number;
    counter: CounterConfiguration;
    metadataKey: string;
    value: string | undefined;
};
export declare function percentOfAllItemsCalculation(metadataKeyValue: MetadataKeyValue | null, metadata: MetaData, _: Trend[], countersConfigurations: CountersConfigurations, totalItems: number): {
    counter: null;
    result: number;
    metadataKey?: undefined;
    value?: undefined;
} | {
    result: number;
    counter: CounterConfiguration;
    metadataKey: string;
    value: string | undefined;
};
export declare function trendCalculation(metadataKeyValue: MetadataKeyValue | null, _: MetaData, trends: Trend[], countersConfigurations: CountersConfigurations): {
    counter: null;
    result: number;
    metadataKey?: undefined;
    value?: undefined;
} | {
    result: number;
    counter: CounterConfiguration;
    metadataKey: string;
    value: string | undefined;
};
export declare function getMetadataKeyValueGroups(metadataKeyValue: MetadataKeyValue | null, countersConfigurations: CountersConfigurations): CounterConfiguration[];
export declare function hasMultipleMembers(metadataKeyValue: MetadataKeyValue | null, countersConfigurations: CountersConfigurations): boolean;
export declare function getMetadataKeyValueConfiguration(metadataKeyValue: MetadataKeyValue | null, countersConfigurations: CountersConfigurations): CounterConfiguration | null;
export declare function calculateSumItemsInMetadata(members: GroupMembers[] | undefined, groups: CounterConfiguration[] | undefined, metadata: MetaData): number;
export declare function getMaxItemValue(members: GroupMembers[] | undefined, groups: CounterConfiguration[] | undefined, metadata: MetaData): {
    metadata?: string;
    value?: string;
    count: number;
};
export declare function getItemCounterConfiguration(metadata: string | undefined, value: string | undefined, countersConfigurations: CountersConfigurations): CounterConfiguration | null;
