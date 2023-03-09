export default function SingleSelect({ options, selectedLabel, onSelect, }: {
    options: string[];
    selectedLabel: string;
    onSelect: (selectedLabel: string) => void;
}): JSX.Element;
