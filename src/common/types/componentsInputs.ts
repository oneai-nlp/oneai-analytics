import { Dispatch, FC, SetStateAction } from 'react';
import {
  CounterType,
  CountersConfigurations,
  MetadataKeyValue,
} from './customizeBarTypes';
import {
  Cluster,
  Item,
  MetaCluster,
  MetaData,
  Phrase,
  Properties,
  Trend,
  UniqueItemsStats,
} from './modals';

export interface OneAiLoaderProps {
  height?: string;
  width?: string;
}

export interface DataNode {
  id: string;
  amount: number;
  text?: string;
  item_original_text?: string | null;
  item_translated_text?: string | null;
  metadata: MetaData;
  properties: { [key: string]: string };
  trends: Trend[];
  type: string;
  metadata_stats?: UniqueItemsStats;
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
  totalItems: number;
  totalUniqueItemsStats?: UniqueItemsStats;
  uniquePropertyName?: string;
  itemPercentageEnabled?: boolean;
  mergeMenuEnabled?: boolean;
  signalsEnabled?: boolean;
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
  totalItems: number;
  totalUniqueItemsStats?: UniqueItemsStats;
  uniquePropertyName?: string;
}

export type NodeType = 'Cluster' | 'Phrase' | 'Item' | 'Meta';
export interface OneAIDataNode {
  type: NodeType;
  data: Cluster | Phrase | Item | MetaCluster;
}

export interface OneAIUserInput {
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
  translationEnabled?: boolean;
  customizeEnabled?: boolean;
  filterOnlySkills?: boolean;
  datePickerEnabled?: boolean;
  startDate?: string | undefined;
  endDate?: string | undefined;
  uniqueMetaKey?: string;
  headerEnabled?: boolean;
  breadCrumbsEnabled?: boolean;
  itemPercentageEnabled?: boolean;
  mergeMenuEnabled?: boolean;
  headerFiltersEnabled?: boolean;
  signalsEnabled?: boolean;
  navigationDropDownEnabled?: boolean;
  tooltipOffsetLeft?: number;
  tooltipOffsetTop?: number;
}

export interface OneAiAnalyticsProps extends OneAIUserInput {
  dataNodes: {
    totalItems: number;
    uniqueItemsStats?: UniqueItemsStats;
    nodes: OneAIDataNode[];
  };
  currentNode?: OneAIDataNode;
  totalPagesAmount?: number;
  currentPage?: number;
  nodeClicked?: (node: Omit<OneAIDataNode & { id: string }, 'data'>) => void;
  goBackClicked?: (skip: number) => void;
  nextPageClicked?: () => void;
  prevPageClicked?: () => void;
  itemsDisplay?: FC<ItemsDisplayComponentProps>;
  loading?: boolean;
  error?: string | null;
  nodesPath?: { text: string; translated?: string | null }[];
  dateRangeChanged?: (from: Date | null, to: Date | null) => void;
  labelsFilters?: MetadataKeyValue[];
  setLabelsFilters?: Dispatch<SetStateAction<MetadataKeyValue[]>>;
  labelClicked?: (key: string, value: string) => void;
  labelFilterDeleted?: (index: number) => void;
  trendPeriods?: number;
  trendPeriodsChanged?: (index: number) => void;
  searchSimilarClusters?: (
    text: string,
    controller: AbortController
  ) => Promise<
    { id: string; text: string; translation: string | null | undefined }[]
  >;
  splitPhrase?: (
    phraseId: string,
    controller: AbortController
  ) => Promise<{ status: 'Success' | 'error'; message: string }>;
  mergeClusters?: (
    source: string[],
    destination: string,
    controller: AbortController
  ) => Promise<{ status: 'Success' | 'error'; message: string }>;
  toggleHide?: (
    node: {
      type: NodeType;
      id: string;
      text: string;
      properties: Properties;
    } | null,
    hide: string
  ) => void;
  propertiesFilters?: Properties;
  setPropertiesFilters?: (properties: Properties) => void;
  metaOptions?: string[];
  currentMetaOption?: string;
  metaOptionsChanged?: (option: string) => void;
  refresh?: () => void;
}

export type OneAIAnalyticsStaticDataWrapperProps = Omit<
  OneAIUserInput & { exampleNodes: ExampleNode[]; collection?: string },
  'dataNodes' | 'totalPagesAmount' | 'currentPage'
>;

export type OneAIAnalyticsApiWrapperProps = {
  domain?: string | 'prod' | 'staging';
  apiKey?: string;
  collection?: string;
  collectionDisplayName?: string;
  refreshToken?: string;
} & OneAIUserInput;

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
  translate: boolean;
  totalItems: number;
}

export interface UploadParams {
  domain?: string;
  apiKey?: string;
  collection?: string;
  darkMode?: boolean;
  steps?: string;
  input_skill?: string;
  resetAfterUpload?: boolean;
  expected_languages?: string;
  override_language_detection?: boolean;
  createCollection?: boolean;
  collectionDomain?: string;
  isPublic?: boolean;
  goToCollection?: () => void;
}
