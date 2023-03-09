export default function DatesFilters({ fromDate, toDate, fromDateChanged, toDateChanged, trendPeriods, trendPeriodsChanged, }: {
    fromDate: Date | null;
    toDate: Date | null;
    fromDateChanged: (date: Date | null) => void;
    toDateChanged: (date: Date | null) => void;
    trendPeriods?: number;
    trendPeriodsChanged?: (index: number) => void;
}): JSX.Element;
