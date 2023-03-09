export declare function calculateFontSize(height: number, width: number): number;
export declare function groupBy<T, K extends keyof any>(arr: T[], key: (i: T) => K): Map<K, T[]>;
export declare function chunks<T>(arr: T[], size: number): Array<T[]>;
export declare function getSecondsDiff(startDate: Date, endDate: Date): number;
export declare function sum(numbers: number[]): number;
export declare function uniqBy<T, K>(arr: T[], getKey: (item: T) => K): T[];
export declare function toLowerKeys(obj: {
    [key: string]: {};
}): {
    [key: string]: {};
};
export declare function percentageIncrease(previous: number, current: number): number;
export declare const numberToFixed: (num: number) => number;
export declare const customNumberToFixed: (num: number) => number;
export declare function getNumberDescription(numIn: number, decPlaces: number): string;
export declare const objectToLowerCase: <T>(obj: Record<string, T>) => {
    [k: string]: T;
};
export declare const extractShtrudelSuffix: (str: string) => string;
