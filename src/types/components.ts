import { TreemapNode } from './clusters';

export interface TreemapProps {
  clusters: TreemapNode[];
  width: number;
  height: number;
  nodeClicked: (node: TreemapNode) => void;
}
