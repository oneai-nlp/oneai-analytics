import { CountersConfigurations } from '../../types/customizeBarTypes';
import { MetaData } from '../../types/modals';
export default function MaxLabelDisplay({ metadataKey, metadata, countersConfiguration, labelClicked, width, maxWidth, }: {
    metadataKey: string;
    metadata: MetaData;
    countersConfiguration: CountersConfigurations;
    labelClicked: (key: string, value: string) => void;
    width?: string;
    maxWidth?: string;
}): JSX.Element;
