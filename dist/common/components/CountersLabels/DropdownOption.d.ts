import { CalculationConfiguration, MetadataKeyValue } from '../../types/customizeBarTypes';
export default function DropdownOption({ label, value, pl, }: {
    label: string;
    value: MetadataKeyValue | CalculationConfiguration | string;
    pl?: number;
}): JSX.Element;
