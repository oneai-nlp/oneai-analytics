import { OneAIDataNode } from '../types/componentsInputs';
import { Cluster, Item, Phrase } from '../types/modals';

export const COLLECTION_TYPE = 'Collection';

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

export function getNodeDetails(
  node: OneAIDataNode | undefined,
  collection: string
): { id: string; type: string } {
  const currentNodeType = node?.type ?? COLLECTION_TYPE;
  const currentNodeId = node ? getNodeId(node) : collection;

  return { id: currentNodeId, type: currentNodeType };
}
