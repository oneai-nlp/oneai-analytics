import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  NodeType,
  OneAIAnalyticsApiWrapperProps,
  OneAIDataNode,
} from '../common/types/components';
import { Cluster, Item, Phrase } from '../common/types/modals';
import { chunks, getSecondsDiff } from '../common/utils/utils';
import { OneAiAnalytics } from '../components/OneAiAnalytics';

const PAGE_SIZE = 25;

const cache: Map<string, { nodes: OneAIDataNode[]; time: Date }> = new Map();

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * One AI Analytics api wrapper component
 */
export const OneAIAnalyticsApiWrapper: FC<OneAIAnalyticsApiWrapperProps> = ({
  domain = 'https://api.oneai.com',
  apiKey = '',
  collection = '',
  ...rest
}) => {
  const [loading, setLoading] = useState(true);
  const [currentNodes, setCurrentNodes] = useState([] as OneAIDataNode[]);
  const [clickedNodes, setClickedNodes] = useState([] as OneAIDataNode[]);
  const [currentPage, setCurrentPage] = useState(0);
  const currentPages = useMemo(() => chunks(currentNodes, PAGE_SIZE), [
    currentNodes,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setCurrentPage(0);
      const currentClicked = clickedNodes.at(-1);

      if (!currentClicked) {
        const cached = getNodesFromCache('Collection', collection, currentPage);
        if (cached) {
          setCurrentNodes(cached);
        } else {
          const clusters = await fetchClusters(domain, collection, apiKey);

          const newNodes = clusters.map(c => {
            return { type: 'Cluster' as NodeType, data: c };
          });

          if (clickedNodes.at(-1) == currentClicked) {
            setCurrentNodes(newNodes);
          }

          cache.clear();
          setNodesInCache('Collection', collection, currentPage, newNodes);
        }
      } else if (currentClicked.type === 'Cluster') {
        const clusterId = (currentClicked.data as Cluster).cluster_id.toString();
        const cached = getNodesFromCache(
          currentClicked.type,
          clusterId,
          currentPage
        );
        if (cached) {
          setCurrentNodes(cached);
        } else {
          const phrases = await fetchPhrases(
            domain,
            collection,
            clusterId,
            apiKey
          );

          const newNodes = phrases.map(p => {
            return { type: 'Phrase' as NodeType, data: p };
          });

          if (clickedNodes.at(-1) == currentClicked) {
            setCurrentNodes(newNodes);
          }
          setNodesInCache(
            currentClicked.type,
            clusterId,
            currentPage,
            newNodes
          );
        }
      } else if (currentClicked.type === 'Phrase') {
        const phraseId = (currentClicked.data as Phrase).phrase_id.toString();
        const cached = getNodesFromCache(
          currentClicked.type,
          phraseId,
          currentPage
        );
        if (cached) {
          setCurrentNodes(cached);
        } else {
          const items = await fetchItems(domain, collection, phraseId, apiKey);

          const newNodes = items.map(i => {
            return { type: 'Item' as NodeType, data: i };
          });

          if (clickedNodes.at(-1) == currentClicked) {
            setCurrentNodes(newNodes);
          }

          setNodesInCache(currentClicked.type, phraseId, currentPage, newNodes);
        }
      }
      setLoading(false);
    };

    fetchData().catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, [domain, collection, apiKey, clickedNodes, currentPage]);

  const nodeClicked = (node: { type: NodeType; id: string }) => {
    if (node.type === 'Cluster') {
      const clickedNode = currentNodes.find(
        n => (n.data as Cluster).cluster_id.toString() === node.id
      );
      if (clickedNode) {
        setClickedNodes(currentClickedCluster => [
          ...currentClickedCluster,
          clickedNode,
        ]);
      }
    } else if (node.type === 'Phrase') {
      const clickedNode = currentNodes.find(
        n => (n.data as Phrase).phrase_id.toString() === node.id
      );
      if (clickedNode) {
        setClickedNodes(currentClickedCluster => [
          ...currentClickedCluster,
          clickedNode,
        ]);
      }
    }
  };

  const goBack = () => {
    setClickedNodes(clickedClusters => {
      clickedClusters.pop();
      return [...clickedClusters];
    });
  };

  return (
    <>
      {currentNodes && (
        <OneAiAnalytics
          dataNodes={
            currentPages.at(currentPage)?.map(node => {
              return { type: node.type, data: node.data };
            }) ?? []
          }
          currentNode={clickedNodes.at(-1)}
          nodeClicked={nodeClicked}
          goBackClicked={goBack}
          currentPage={currentPage}
          totalPagesAmount={currentPages.length}
          nextPageClicked={() => setCurrentPage(page => page + 1)}
          prevPageClicked={() => setCurrentPage(page => page - 1)}
          loading={loading}
          {...rest}
        />
      )}
    </>
  );
};

async function fetchClusters(
  domain: string,
  collection: string,
  apiKey: string
): Promise<Cluster[]> {
  return await fetchApi(
    `${domain}/clustering/v1/collections/${collection}/clusters`,
    apiKey,
    'clusters'
  );
}

async function fetchPhrases(
  domain: string,
  collection: string,
  clusterId: string,
  apiKey: string
): Promise<Phrase[]> {
  return await fetchApi(
    `${domain}/clustering/v1/collections/${collection}/clusters/${clusterId}/phrases`,
    apiKey,
    'phrases'
  );
}

async function fetchItems(
  domain: string,
  collection: string,
  phraseId: string,
  apiKey: string
): Promise<Item[]> {
  return await fetchApi(
    `${domain}/clustering/v1/collections/${collection}/phrases/${phraseId}/items`,
    apiKey,
    'items'
  );
}

async function fetchApi<T>(
  url: string,
  apiKey: string,
  accessor: string
): Promise<T[]> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    });

    if (res.status !== 200 || !res.ok) return [];

    const json = await res.json();

    console.log(json);

    return json[accessor];
  } catch (e) {
    console.error('error occurred ->', e);
    return [];
  }
}

function getNodesFromCache(
  parentType: string,
  parentId: string,
  page: number
): OneAIDataNode[] | null {
  const cached = cache.get(assembleCacheId(parentType, parentId, page));
  if (cached && getSecondsDiff(cached.time, new Date()) < 90) {
    return cached.nodes;
  }

  return null;
}

function setNodesInCache(
  parentType: string,
  parentId: string,
  page: number,
  nodes: OneAIDataNode[]
) {
  cache.set(assembleCacheId(parentType, parentId, page), {
    nodes: nodes,
    time: new Date(),
  });
}

function assembleCacheId(type: string, id: string, page: number): string {
  return `${type}-${id}-${page}`;
}
