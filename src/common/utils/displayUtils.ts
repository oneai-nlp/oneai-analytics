import { MetadataKeyValue } from '../types/customizeBarTypes';

export function getMetadataKeyValueDisplay(metadataKeyValue: MetadataKeyValue) {
  if (!metadataKeyValue.value) return metadataKeyValue.key;
  return `${metadataKeyValue.key}.${metadataKeyValue.value}`;
}
