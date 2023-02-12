import { OneAIDataNode } from '../types/componentsInputs';
import { Cluster, Item, MetaCluster, Phrase, Trend } from '../types/modals';

export const COLLECTION_TYPE = 'Collection';

export function getNodeText(node: OneAIDataNode): string {
  return node.type === 'Cluster'
    ? (node.data as Cluster).cluster_phrase
    : node.type === 'Phrase'
    ? (node.data as Phrase).text
    : node.type === 'Meta'
    ? (node.data as MetaCluster).meta_value
    : (node.data as Item).original_text;
}

export function getNodeId(node: OneAIDataNode): string {
  return (
    node.type === 'Cluster'
      ? (node.data as Cluster).cluster_id
      : node.type === 'Phrase'
      ? (node.data as Phrase).phrase_id
      : node.type === 'Meta'
      ? (node.data as MetaCluster).meta_key +
        '$$' +
        (node.data as MetaCluster).meta_value
      : (node.data as Item).id
  ).toString();
}

export function getNodeItemsCount(node: OneAIDataNode): number {
  return node.type === 'Cluster'
    ? (node.data as Cluster).items_count
    : node.type === 'Phrase'
    ? (node.data as Phrase).items_count
    : node.type === 'Meta'
    ? (node.data as MetaCluster).items_count
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

export function getNodeTrends(node: OneAIDataNode | undefined): Trend[] {
  if (!node) return [];
  return node.type === 'Cluster'
    ? (node.data as Cluster).trends ?? []
    : node.type === 'Phrase'
    ? (node.data as Phrase).trends ?? []
    : node.type === 'Meta'
    ? (node.data as MetaCluster).trends ?? []
    : [];
}

export const getNodeOriginalAndTranslatedText = (
  node: OneAIDataNode | undefined
) => {
  if (!node) return { originalText: undefined, translatedText: undefined };
  if (['Cluster', 'Phrase', 'Item'].includes(node.type)) {
    const cluster = node.data as Cluster;
    return {
      originalText: cluster.item_original_text,
      translatedText:
        cluster.item_translated_text ?? cluster.item_original_text,
    };
  }

  if (node.type === 'Meta') {
    const item = node.data as MetaCluster;
    return {
      originalText: item.meta_value,
      translatedText: item.meta_value,
    };
  }
  return { originalText: undefined, translatedText: undefined };
};
