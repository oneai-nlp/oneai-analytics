import { CalculationConfiguration, CountersConfigurations, CounterType, MetadataKeyValue } from '../types/customizeBarTypes';
export default function CustomizeTab({ currentCounters, selectedLabels, countersConfigurations, calculationsConfigurations, labelsOptions, countersChanged, labelsChanged, currentColorsAxis, selectedSizeAxis, colorsAxisChanged, sizeAxisChanged, }: {
    currentCounters: CounterType[];
    selectedLabels: string[];
    countersConfigurations: CountersConfigurations;
    calculationsConfigurations: CalculationConfiguration[];
    labelsOptions: string[];
    countersChanged: (counters: CounterType[]) => void;
    labelsChanged: (labels: string[]) => void;
    currentColorsAxis: CounterType[];
    selectedSizeAxis: MetadataKeyValue | null;
    colorsAxisChanged: (counters: CounterType[]) => void;
    sizeAxisChanged: (metadataKeyValue: MetadataKeyValue) => void;
}): JSX.Element;
