import { FC } from 'react';
import { Item, TreemapNode } from './modals';
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
  textColor: string;
}

export interface OneAiAnalyticsProps {
  treemapBigColor?: string;
  treemapSmallColor?: string;
  treemapCountFontSize?: number;
  treemapFontFamily?: string;
  treemapTextColor?: string;
  navbarColor?: string;
  clusters: TreemapNode[];
  itemsDisplay?: FC<ItemsDisplayComponentProps>;
}

export type OneAIAnalyticsItemsWrapperProps = Omit<
  OneAiAnalyticsProps & { items: Item[] },
  'clusters'
>;
