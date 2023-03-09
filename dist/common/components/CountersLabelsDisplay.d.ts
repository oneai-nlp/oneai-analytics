import { CountersConfigurations, CounterType } from '../types/customizeBarTypes';
import { MetaData, Trend } from '../types/modals';
export default function CountersLabelsDisplay({ counters, labels, metadata, countersConfiguration, trends, labelClicked, counterWidth, counterMaxWidth, labelWidth, labelMaxWidth, totalItems, }: {
    counters: CounterType[];
    labels: string[];
    metadata: MetaData;
    countersConfiguration: CountersConfigurations;
    trends: Trend[];
    labelClicked: (key: string, value: string) => void;
    totalItems: number;
    counterWidth?: string;
    counterMaxWidth?: string;
    labelWidth?: string;
    labelMaxWidth?: string;
}): JSX.Element;
