export interface Item {
  id: number;
  create_date: string;
  original_text: string;
  distance_to_phrase: number;
  metadata: {} | null;
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
  items_count: number;
  metadata: {} | null;
  text: string;
}

export interface Cluster {
  cluster_id: number;
  collection: string;
  cluster_phrase: string;
  phrases_count: number;
  metadata: {} | null;
  items_count: number;
}
