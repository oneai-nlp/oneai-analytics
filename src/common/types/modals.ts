export interface MetaData {
  [key: string]: { value: string; count: number }[];
}

export interface Properties {
  [key: string]: string;
}

export interface Trend {
  period_start_date: string;
  period_end_date: string;
  days: number;
  items_count: number;
  phrases_count: number;
  metadata: MetaData;
}

export interface Item {
  id: number;
  create_date: string;
  item_timestamp: string;
  original_text: string;
  distance_to_phrase: number;
  metadata: MetaData;
  item_original_text?: string | null;
  item_translated_text?: string | null;
  phrase: {
    id: number;
    text: string;
  };
  cluster: {
    id: number;
    text: string;
  };
  properties: Properties;
}

export interface Phrase {
  phrase_id: number;
  text: string;
  items_count: number;
  metadata: MetaData;
  item_original_text?: string | null;
  item_translated_text?: string | null;
  trends: Trend[];
  properties: Properties;
  metadata_stats: UniqueItemsStats;
}

export interface Cluster {
  cluster_id: number;
  collection: string;
  cluster_phrase: string;
  phrases_count: number;
  metadata: MetaData;
  items_count: number;
  item_original_text?: string | null;
  item_translated_text?: string | null;
  trends: Trend[];
  properties: Properties;
  metadata_stats: UniqueItemsStats;
}

export interface MetaCluster {
  organization_id: string;
  collection_id: string;
  meta_key: string;
  meta_value: string;
  meta_count: number;
  clusters_count: number;
  phrases_count: number;
  items_count: number;
  metadata: MetaData;
  trends: Trend[];
  properties: Properties;
}

export interface UniqueItemsStats {
  unique_values_count: {
    meta_key: string;
    unique_values_count: number;
  }[];
  overall_unique_keys_count: number;
}
