export interface MetaData {
  [key: string]: { value: string; count: number }[];
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
}

export interface Phrase {
  phrase_id: number;
  text: string;
  items_count: number;
  metadata: MetaData;
  item_original_text?: string | null;
  item_translated_text?: string | null;
  trends: Trend[];
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
}
