import { CountersConfigurations, MetadataKeyValue } from '../../types/customizeBarTypes';
export default function KeyValueSingleSelect({ metadataKeyValue, countersConfigurations, selectedMetadataKeyValueChange, placeholder, }: {
    metadataKeyValue: MetadataKeyValue | null;
    selectedMetadataKeyValueChange: (newMetadataKeyValue: MetadataKeyValue) => void;
    countersConfigurations: CountersConfigurations;
    placeholder: string;
}): JSX.Element;
