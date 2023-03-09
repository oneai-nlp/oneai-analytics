export default function SingleSelect({ options, selectedLabelId, onSelect, }: {
    options: {
        id: string;
        label: string;
    }[];
    selectedLabelId: string | null;
    onSelect: (selectedLabelId: string) => void;
}): JSX.Element;
