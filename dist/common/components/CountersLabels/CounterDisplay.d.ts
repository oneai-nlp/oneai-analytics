import { CountersConfigurations, CounterType } from '../../types/customizeBarTypes';
import { MetaData, Trend } from '../../types/modals';
export default function CounterDisplay({ counter, metadata, countersConfiguration, trends, totalItems, width, maxWidth, }: {
    counter: CounterType;
    metadata: MetaData;
    countersConfiguration: CountersConfigurations;
    trends: Trend[];
    totalItems: number;
    width?: string;
    maxWidth?: string;
}): JSX.Element;
