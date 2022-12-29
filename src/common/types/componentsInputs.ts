import { FC } from 'react';
import { Cluster, Item, MetaData, Phrase, Trend } from './modals';
import {
  CountersConfigurations,
  CounterType,
  MetadataKeyValue,
} from './customizeBarTypes';

export interface DataNode {
  id: string;
  amount: number;
  text?: string;
  item_original_text?: string | null;
  item_translated_text?: string | null;
  metadata: MetaData;
  trends: Trend[];
  type: string;
}

export interface TreemapProps {
  dataNodes: DataNode[];
  width: number;
  height: number;
  nodeClicked: (node: DataNode) => void;
  bigColor?: string;
  smallColor?: string;
  countFontSize?: number;
  fontFamily?: string;
  textColor?: string;
  borderWidth?: number;
  borderColor?: string;
  labels: string[];
  counters: CounterType[];
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
  sizeAxis: MetadataKeyValue | null;
  colorAxis: CounterType[];
  nodeActionsClicked: (node: DataNode) => void;
  translate: boolean;
}

export interface BarChartProps {
  dataNodes: DataNode[];
  width: number;
  height: number;
  nodeClicked: (node: DataNode) => void;
  barColor?: string;
  fontFamily?: string;
  textColor?: string;
  labels: string[];
  counters: CounterType[];
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
  sizeAxis: MetadataKeyValue | null;
  colorAxis: CounterType[];
  nodeActionsClicked: (node: DataNode) => void;
  translate: boolean;
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
  goBackClicked?: (skip: number) => void;
  nextPageClicked?: () => void;
  prevPageClicked?: () => void;
  darkMode?: boolean;
  background?: string;
  treemapBigColor?: string;
  treemapSmallColor?: string;
  treemapCountFontSize?: number;
  fontFamily?: string;
  textColor?: string;
  treemapBorderWidth?: number;
  treemapBorderColor?: string;
  navbarColor?: string;
  barColor?: string;
  itemsDisplay?: FC<ItemsDisplayComponentProps>;
  loading?: boolean;
  error?: string | null;
  nodesPath?: string[];
  dateRangeChanged?: (from: Date | null, to: Date | null) => void;
  labelsFilters?: MetadataKeyValue[];
  labelClicked?: (key: string, value: string) => void;
  labelFilterDeleted?: (index: number) => void;
  trendPeriods?: number;
  trendPeriodsChanged?: (index: number) => void;
  searchSimilarClusters?: (
    text: string,
    controller: AbortController
  ) => Promise<{ id: string; text: string }[]>;
  splitPhrase?: (
    phraseId: string,
    controller: AbortController
  ) => Promise<{ status: 'Success' | 'error'; message: string }>;
  mergeClusters?: (
    source: string,
    destination: string,
    controller: AbortController
  ) => Promise<{ status: 'Success' | 'error'; message: string }>;
  translationEnabled?: boolean;
}

export type OneAIAnalyticsStaticDataWrapperProps = Omit<
  OneAiAnalyticsProps & { exampleNodes: ExampleNode[]; collection?: string },
  'dataNodes' | 'totalPagesAmount' | 'currentPage'
>;

export type OneAIAnalyticsApiWrapperProps = Omit<
  OneAiAnalyticsProps & {
    domain?: string;
    apiKey?: string;
    collection?: string;
    refreshToken?: string;
  },
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

export interface ItemsDisplayComponentProps {
  items: Item[];
  bgColor?: string;
  textColor?: string;
  labels: string[];
  counters: CounterType[];
  countersConfiguration: CountersConfigurations;
  labelClicked: (key: string, value: string) => void;
}
