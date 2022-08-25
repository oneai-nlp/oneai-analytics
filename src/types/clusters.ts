export interface TreemapNode {
  type: 'Node' | 'Cluster' | 'Phrase';
  id: string;
  items_count: number;
  skill?: string;
  text?: string;
  items?: Item[];
  children?: TreemapNode[];
}

export interface Item {
  text: string;
  count: number;
}
