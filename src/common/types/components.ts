import { FC } from 'react';
import { Cluster, Item, Phrase } from './modals';
import { ItemsDisplayComponentProps } from './configurations';

export interface TreemapDataNode {
  id: string;
  amount: number;
  text?: string;
}

export interface TreemapProps {
  dataNodes: TreemapDataNode[];
  width: number;
  height: number;
  nodeClicked: (node: TreemapDataNode) => void;
  bigColor?: string;
  smallColor?: string;
  countFontSize?: number;
  fontFamily?: string;
  textColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

export type NodeType = 'Cluster' | 'Phrase' | 'Item';
export interface OneAIDataNode {
  type: NodeType;
  data: Cluster | Phrase | Item;
}

export interface OneAiAnalyticsProps {
  dataNodes: OneAIDataNode[];
  currentNode?: OneAIDataNode;
  totalPagesAmount?: number;
  currentPage?: number;
  nodeClicked?: (node: Omit<OneAIDataNode & { id: string }, 'data'>) => void;
  goBackClicked?: () => void;
  nextPageClicked?: () => void;
  prevPageClicked?: () => void;
  treemapBigColor?: string;
  treemapSmallColor?: string;
  treemapCountFontSize?: number;
  treemapFontFamily?: string;
  treemapTextColor?: string;
  treemapBorderWidth?: number;
  treemapBorderColor?: string;
  navbarColor?: string;
  itemsDisplay?: FC<ItemsDisplayComponentProps>;
}

export type OneAIAnalyticsApiWrapperProps = Omit<
  OneAiAnalyticsProps & { exampleNodes: ExampleNode[] },
  'dataNodes' | 'totalPagesAmount' | 'currentPage'
>;

export interface ExampleNode {
  type: NodeType;
  id: string;
  text: string;
  items_count: number;
  items?: string[];
  children?: ExampleNode[];
}
