import React, { FC, useEffect, useRef, useState } from 'react';
import {
  NodeType,
  OneAIAnalyticsApiWrapperProps,
  OneAIDataNode,
} from '../common/types/componentsInputs';
import { Cluster, Item, Phrase } from '../common/types/modals';
import {
  COLLECTION_TYPE,
  getNodeDetails,
  getNodeId,
  getNodeText,
} from '../common/utils/modalsUtils';
import { getSecondsDiff } from '../common/utils/utils';
import { OneAiAnalytics } from '../components/OneAiAnalytics';

const PAGE_SIZE = 25;

const cache: Map<
  string,
  { nodes: OneAIDataNode[]; totalPages: number; time: Date }
> = new Map();

const nodeToPageCache: Map<string, number> = new Map();

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * One AI Analytics api wrapper component
 */
export const OneAIAnalyticsApiWrapper: FC<OneAIAnalyticsApiWrapperProps> = ({
  domain = 'https://api.oneai.com',
  apiKey = '',
  collection = '',
  refreshToken = '',
  ...rest
}) => {
  const [loading, setLoading] = useState(true);
  const [currentNodes, setCurrentNodes] = useState([] as OneAIDataNode[]);
  const [clickedNodes, setClickedNodes] = useState([] as OneAIDataNode[]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const previousValues = useRef({
    domain: null as string | null,
    apiKey: null as string | null,
    collection: null as string | null,
    refreshToken: null as string | null,
    clickedNodes: null as OneAIDataNode[] | null,
    currentPage: null as number | null,
  });
  const fetchFinished = useRef(true);

  useEffect(() => {
    if (
      previousValues.current.domain !== domain ||
      previousValues.current.apiKey !== apiKey ||
      previousValues.current.collection !== collection ||
      previousValues.current.refreshToken !== refreshToken
    ) {
      setCurrentNodes([]);
      setClickedNodes([]);
      setCurrentPage(0);
      cache.clear();

      previousValues.current = {
        domain,
        apiKey,
        collection,
        refreshToken,
        clickedNodes: null,
        currentPage: null,
      };
    }
  }, [domain, apiKey, collection, refreshToken]);

  useEffect(() => {
    const fetchData = async () => {
      fetchFinished.current = false;
      setLoading(true);
      const currentClicked = clickedNodes.at(-1);

      if (!currentClicked) {
        const cached = getNodesFromCache(
          COLLECTION_TYPE,
          collection,
          currentPage
        );
        if (cached) {
          setTotalPages(cached.totalPages);
          setCurrentNodes(cached.nodes);
        } else {
          const clusters = await fetchClusters(
            domain,
            collection,
            apiKey,
            currentPage
          );

          const newNodes = clusters.data.map((c) => {
            return { type: 'Cluster' as NodeType, data: c };
          });

          if (clickedNodes.at(-1) == currentClicked) {
            setCurrentNodes(newNodes);
            setTotalPages(clusters.totalPages);
          }

          setNodesDataInCache(
            'Collection',
            collection,
            currentPage,
            newNodes,
            clusters.totalPages
          );
        }
      } else if (currentClicked.type === 'Cluster') {
        const clusterId = (
          currentClicked.data as Cluster
        ).cluster_id.toString();
        const cached = getNodesFromCache(
          currentClicked.type,
          clusterId,
          currentPage
        );
        if (cached) {
          setTotalPages(cached.totalPages);
          setCurrentNodes(cached.nodes);
        } else {
          const phrases = await fetchPhrases(
            domain,
            collection,
            clusterId,
            apiKey,
            currentPage
          );

          const newNodes = phrases.data.map((p) => {
            return { type: 'Phrase' as NodeType, data: p };
          });

          if (clickedNodes.at(-1) == currentClicked) {
            setCurrentNodes(newNodes);
            setTotalPages(phrases.totalPages);
          }
          setNodesDataInCache(
            currentClicked.type,
            clusterId,
            currentPage,
            newNodes,
            phrases.totalPages
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
          setTotalPages(cached.totalPages);
          setCurrentNodes(cached.nodes);
        } else {
          const items = await fetchItems(
            domain,
            collection,
            phraseId,
            apiKey,
            currentPage
          );

          const newNodes = items.data.map((i) => {
            return { type: 'Item' as NodeType, data: i };
          });

          if (clickedNodes.at(-1) == currentClicked) {
            setCurrentNodes(newNodes);
            setTotalPages(items.totalPages);
          }

          setNodesDataInCache(
            currentClicked.type,
            phraseId,
            currentPage,
            newNodes,
            items.totalPages
          );
        }
      }
      setLoading(false);
      fetchFinished.current = true;
    };
    if (
      previousValues.current.domain !== domain ||
      previousValues.current.apiKey !== apiKey ||
      previousValues.current.collection !== collection ||
      previousValues.current.clickedNodes != clickedNodes ||
      previousValues.current.currentPage !== currentPage
    ) {
      if (fetchFinished.current) {
        fetchData().catch((e) => {
          console.error(e);
          setLoading(false);
          fetchFinished.current = true;
        });

        previousValues.current = {
          domain,
          apiKey,
          collection,
          clickedNodes,
          currentPage,
          refreshToken,
        };
      }
    }
  }, [domain, collection, apiKey, clickedNodes, currentPage]);

  const nodeClicked = (node: { type: NodeType; id: string }) => {
    const currentNodeDetails = getNodeDetails(clickedNodes.at(-1), collection);
    setNodePageNumberInCache(
      currentNodeDetails.type,
      currentNodeDetails.id,
      currentPage
    );
    let clickedNode: OneAIDataNode | null = null;
    if (node.type === 'Cluster') {
      clickedNode =
        currentNodes.find(
          (n) => (n.data as Cluster).cluster_id.toString() === node.id
        ) ?? null;
    } else if (node.type === 'Phrase') {
      clickedNode =
        currentNodes.find(
          (n) => (n.data as Phrase).phrase_id.toString() === node.id
        ) ?? null;
    }

    if (clickedNode) {
      const nodeCachedPage = getNodePageNumberFromCache(
        clickedNode.type,
        getNodeId(clickedNode)
      );
      setCurrentPage(nodeCachedPage);
      setClickedNodes((currentClickedCluster) => [
        ...currentClickedCluster,
        clickedNode as OneAIDataNode,
      ]);
    }
  };

  const goBack = (skip: number = 1) => {
    if (skip === 0) return;
    setClickedNodes((clickedClusters) => {
      for (let i = 0; i < skip; i++) {
        clickedClusters.pop();
      }
      const currentNodeDetails = getNodeDetails(
        clickedClusters.at(-1),
        collection
      );
      const nodeCachedPage = getNodePageNumberFromCache(
        currentNodeDetails.type,
        currentNodeDetails.id
      );
      setCurrentPage(nodeCachedPage);
      return [...clickedClusters];
    });
  };

  return (
    currentNodes && (
      <OneAiAnalytics
        dataNodes={currentNodes ?? []}
        currentNode={clickedNodes.at(-1)}
        nodeClicked={nodeClicked}
        goBackClicked={goBack}
        currentPage={currentPage}
        totalPagesAmount={totalPages}
        nextPageClicked={() => setCurrentPage((page) => page + 1)}
        prevPageClicked={() => setCurrentPage((page) => page - 1)}
        loading={loading}
        nodesPath={[collection, ...clickedNodes.map(getNodeText)]}
        {...rest}
      />
    )
  );
};

async function fetchClusters(
  domain: string,
  collection: string,
  apiKey: string,
  page: number
): Promise<{ totalPages: number; data: Cluster[] }> {
  return await fetchApi(
    `${domain}/clustering/v1/collections/${collection}/clusters`,
    apiKey,
    'clusters',
    page
  );
}

async function fetchPhrases(
  domain: string,
  collection: string,
  clusterId: string,
  apiKey: string,
  page: number
): Promise<{ totalPages: number; data: Phrase[] }> {
  return await fetchApi(
    `${domain}/clustering/v1/collections/${collection}/clusters/${clusterId}/phrases`,
    apiKey,
    'phrases',
    page
  );
}

async function fetchItems(
  domain: string,
  collection: string,
  phraseId: string,
  apiKey: string,
  page: number
): Promise<{ totalPages: number; data: Item[] }> {
  return await fetchApi(
    `${domain}/clustering/v1/collections/${collection}/phrases/${phraseId}/items`,
    apiKey,
    'items',
    page
  );
}

async function fetchApi<T>(
  url: string,
  apiKey: string,
  accessor: string,
  page: number
): Promise<{ totalPages: number; data: T[] }> {
  try {
    const res = await fetch(`${url}?page=${page}&limit=${PAGE_SIZE}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    });

    if (res.status !== 200 || !res.ok) return { totalPages: 0, data: [] };

    const json = await res.json();

    return { totalPages: json['total_pages'], data: json[accessor] };
  } catch (e) {
    console.error('error occurred ->', e);
    return { totalPages: 0, data: [] };
  }
}

function getNodesFromCache(
  parentType: string,
  parentId: string,
  page: number
): { nodes: OneAIDataNode[]; totalPages: number; time: Date } | null {
  const cached = cache.get(assembleCacheId(parentType, parentId, page));
  if (cached && getSecondsDiff(cached.time, new Date()) < 90) {
    return cached;
  }

  return null;
}

function setNodesDataInCache(
  parentType: string,
  parentId: string,
  page: number,
  nodes: OneAIDataNode[],
  totalPages: number
) {
  cache.set(assembleCacheId(parentType, parentId, page), {
    nodes: nodes,
    totalPages: totalPages,
    time: new Date(),
  });
}

function getNodePageNumberFromCache(nodeType: string, nodeId: string): number {
  const cached = nodeToPageCache.get(assembleCacheId(nodeType, nodeId));
  if (cached) {
    return cached;
  }

  return 0;
}

function setNodePageNumberInCache(
  nodeType: string,
  nodeId: string,
  page: number
) {
  nodeToPageCache.set(assembleCacheId(nodeType, nodeId), page);
}

function assembleCacheId(type: string, id: string, page: number = 0): string {
  return `${type}-${id}-${page}`;
}
