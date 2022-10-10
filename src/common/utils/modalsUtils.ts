import { OneAIDataNode } from '../types/components';
import { Cluster, Item, Phrase } from '../types/modals';

export function getNodeText(node: OneAIDataNode): string {
  return node.type === 'Cluster'
    ? (node.data as Cluster).cluster_phrase
    : node.type === 'Phrase'
    ? (node.data as Phrase).text
    : (node.data as Item).original_text;
}

export function getNodeId(node: OneAIDataNode): string {
  return (
    node.type === 'Cluster'
      ? (node.data as Cluster).cluster_id
      : node.type === 'Phrase'
      ? (node.data as Phrase).phrase_id
      : (node.data as Item).id
  ).toString();
}

export function getNodeItemsCount(node: OneAIDataNode): number {
  return node.type === 'Cluster'
    ? (node.data as Cluster).items_count
    : node.type === 'Phrase'
    ? (node.data as Phrase).items_count
    : 1;
}
