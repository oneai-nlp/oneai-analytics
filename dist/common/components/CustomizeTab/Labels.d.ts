export default function Labels({ currentLabels, labelsOptions, labelsChanged, title, }: {
    currentLabels: string[];
    labelsOptions: string[];
    labelsChanged: (labels: string[]) => void;
    title?: string;
}): JSX.Element;
