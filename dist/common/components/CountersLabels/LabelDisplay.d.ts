import { CountersConfigurations } from '../../types/customizeBarTypes';
export default function LabelDisplay({ metadataKey, value, countersConfiguration, labelClicked, tooltip, width, maxWidth, color, }: {
    metadataKey: string;
    value: string;
    countersConfiguration: CountersConfigurations;
    labelClicked: (key: string, value: string) => void;
    tooltip?: string;
    width?: string;
    maxWidth?: string;
    color?: string;
}): JSX.Element;
