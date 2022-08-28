import { FC } from 'react';
import { TreemapNode } from './clusters';
import { ItemsDisplayComponentProps } from './configurations';

export interface TreemapProps {
  clusters: TreemapNode[];
  width: number;
  height: number;
  nodeClicked: (node: TreemapNode) => void;
  bigColor: string;
  smallColor: string;
  countFontSize: number;
  fontFamily: string;
}

export interface OneAiAnalyticsProps {
  treemapBigColor?: string;
  treemapSmallColor?: string;
  treemapCountFontSize?: number;
  treemapFontFamily?: string;
  navbarColor?: string;
  clusters: TreemapNode[];
  itemsDisplay?: FC<ItemsDisplayComponentProps>;
}
