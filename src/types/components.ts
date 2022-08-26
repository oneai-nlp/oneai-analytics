import { FC } from 'react';
import { TreemapNode } from './clusters';
import { ItemsDisplayComponentProps } from './configurations';

export interface TreemapProps {
  clusters: TreemapNode[];
  width: number;
  height: number;
  nodeClicked: (node: TreemapNode) => void;
  darkestColor: string;
  countFontSize: number;
}

export interface OneAiAnalyticsProps {
  clusters: TreemapNode[];
  itemsDisplay?: FC<ItemsDisplayComponentProps>;
  darkestColor?: string;
  treemapCountFontSize?: number;
}
