import moment from 'moment';
export const IGNORE_ID = 'False';
export const CUSTOM_VALUE_ID = 'CUSTOM_VALUE';

export const COLUMN_TYPES_OPTIONS = [
  { id: IGNORE_ID, label: 'ignore' },
  { id: 'input', label: 'text' },
  { id: 'input_translated', label: 'translation' },
  {
    id: 'timestamp',
    label: 'date & time',
    validation: (value: string) =>
      moment(value, moment.ISO_8601, true).isValid(),
  },
  { id: CUSTOM_VALUE_ID, label: 'custom value' },
];
