export default function Datepicker({ selectedDate, dateChanged, placeholder, }: {
    selectedDate: Date | null;
    placeholder?: string;
    dateChanged: (date: Date) => void;
}): JSX.Element;
