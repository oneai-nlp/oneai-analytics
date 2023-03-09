import { CountersConfigurations, MetadataKeyValue } from '../../types/customizeBarTypes';
export default function LabelsFiltersSelect({ selectedLabels, countersConfigurations, selectedMetadataKeyValueChange, }: {
    selectedLabels: MetadataKeyValue[];
    selectedMetadataKeyValueChange: (newMetadataKeyValue: MetadataKeyValue) => void;
    countersConfigurations: CountersConfigurations;
}): JSX.Element;
