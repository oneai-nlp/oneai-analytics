import { CalculationConfiguration, CountersConfigurations, CounterType } from '../../types/customizeBarTypes';
export default function Counters({ countersConfigurations, calculationsConfigurations, currentCounters, countersChanged, addCounterText, title, }: {
    countersConfigurations: CountersConfigurations;
    calculationsConfigurations: CalculationConfiguration[];
    currentCounters: CounterType[];
    countersChanged: (counters: CounterType[]) => void;
    addCounterText: string;
    title: string;
}): JSX.Element;
