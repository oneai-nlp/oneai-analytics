import { format } from 'date-fns';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  NodeType,
  OneAIAnalyticsApiWrapperProps,
  OneAIDataNode,
} from '../common/types/componentsInputs';
import { MetadataKeyValue } from '../common/types/customizeBarTypes';
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
  const [error, setError] = useState(null as string | null);
  const [currentNodes, setCurrentNodes] = useState([] as OneAIDataNode[]);
  const [clickedNodes, setClickedNodes] = useState([] as OneAIDataNode[]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dateRange, setDateRange] = useState([
    null,
    null,
  ] as Array<Date | null>);
  const [labelsFilters, setLabelsFilters] = useState([] as MetadataKeyValue[]);
  const [localRefreshToken, setLocalRefreshToken] = useState(refreshToken);
  const [trendPeriods, setTrendPeriods] = useState(0);

  const previousValues = useRef({
    domain: null as string | null,
    apiKey: null as string | null,
    collection: null as string | null,
    refreshToken: null as string | null,
    localRefreshToken: null as string | null,
    clickedNodes: null as OneAIDataNode[] | null,
    currentPage: null as number | null,
  });

  useEffect(() => {
    if (
      previousValues.current.domain !== domain ||
      previousValues.current.apiKey !== apiKey ||
      previousValues.current.collection !== collection ||
      previousValues.current.refreshToken !== refreshToken ||
      previousValues.current.localRefreshToken !== localRefreshToken
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
        localRefreshToken,
        clickedNodes: null,
        currentPage: null,
      };
    }
  }, [domain, apiKey, collection, refreshToken, localRefreshToken]);

  useEffect(() => {
    const fetchData = async (controller: AbortController) => {
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
            controller,
            domain,
            collection,
            apiKey,
            currentPage,
            dateRange[0],
            dateRange[1],
            labelsFilters,
            trendPeriods
          );
          if (clusters.error) {
            if (clusters.error.includes('AbortError')) {
              return;
            }

            setError(clusters.error);
            return setLoading(false);
          }
          setError(null);

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
            controller,
            domain,
            collection,
            clusterId,
            apiKey,
            currentPage,
            dateRange[0],
            dateRange[1],
            labelsFilters,
            trendPeriods
          );
          if (phrases.error) {
            if (phrases.error.includes('AbortError')) {
              return;
            }
            setError(phrases.error);
            return setLoading(false);
          }
          setError(null);

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
            controller,
            domain,
            collection,
            phraseId,
            apiKey,
            currentPage,
            dateRange[0],
            dateRange[1],
            labelsFilters,
            trendPeriods
          );
          if (items.error) {
            if (items.error.includes('AbortError')) {
              return;
            }
            setError(items.error);
            return setLoading(false);
          }
          setError(null);

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
    };
    const controller = new AbortController();
    if (
      previousValues.current.domain !== domain ||
      previousValues.current.apiKey !== apiKey ||
      previousValues.current.collection !== collection ||
      previousValues.current.clickedNodes != clickedNodes ||
      previousValues.current.currentPage !== currentPage
    ) {
      fetchData(controller).catch((e) => {
        console.error(e);
        setLoading(false);
      });

      previousValues.current = {
        domain,
        apiKey,
        collection,
        clickedNodes,
        currentPage,
        refreshToken,
        localRefreshToken,
      };
    }

    return () => {
      controller.abort();
    };
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

  return currentNodes ? (
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
      error={error}
      nodesPath={[collection, ...clickedNodes.map(getNodeText)]}
      dateRangeChanged={(from, to) =>
        setLocalRefreshToken((current) => {
          setDateRange([from, to]);
          return current + '1';
        })
      }
      labelsFilters={labelsFilters}
      labelClicked={(key, value) => {
        if (
          !labelsFilters.some(
            (keyValue) => keyValue.key === key && keyValue.value === value
          )
        )
          setLocalRefreshToken((current) => {
            setLabelsFilters([{ key, value }]);
            return current + '1';
          });
      }}
      labelFilterDeleted={(i) =>
        setLocalRefreshToken((current) => {
          setLabelsFilters((filters) => {
            filters.splice(i, 1);
            return [...filters];
          });
          return current + '1';
        })
      }
      trendPeriods={trendPeriods}
      trendPeriodsChanged={(newTrendPeriod) =>
        setLocalRefreshToken((current) => {
          setTrendPeriods(newTrendPeriod);
          return current + '1';
        })
      }
      searchSimilarClusters={(text, controller) =>
        searchSimilarClusters(controller, domain, collection, apiKey, text)
      }
      splitPhrase={(phraseId, controller) =>
        splitPhrase(
          controller,
          domain,
          collection,
          apiKey,
          phraseId,
          setLocalRefreshToken
        )
      }
      mergeClusters={(source, destination, controller) =>
        mergeClusters(
          controller,
          domain,
          collection,
          apiKey,
          source,
          destination,
          setLocalRefreshToken
        )
      }
      {...rest}
    />
  ) : null;
};

async function fetchClusters(
  controller: AbortController,
  domain: string,
  collection: string,
  apiKey: string,
  page: number,
  from: Date | null,
  to: Date | null,
  labelsFilters: MetadataKeyValue[],
  trendPeriods: number
): Promise<{ totalPages: number; data: Cluster[]; error: string | null }> {
  return await fetchApi(
    controller,
    `${domain}/clustering/v1/collections/${collection}/clusters`,
    apiKey,
    'clusters',
    page,
    from,
    to,
    labelsFilters,
    trendPeriods
  );
}

async function fetchPhrases(
  controller: AbortController,
  domain: string,
  collection: string,
  clusterId: string,
  apiKey: string,
  page: number,
  from: Date | null,
  to: Date | null,
  labelsFilters: MetadataKeyValue[],
  trendPeriods: number
): Promise<{ totalPages: number; data: Phrase[]; error: string | null }> {
  return await fetchApi(
    controller,
    `${domain}/clustering/v1/collections/${collection}/clusters/${clusterId}/phrases`,
    apiKey,
    'phrases',
    page,
    from,
    to,
    labelsFilters,
    trendPeriods
  );
}

async function fetchItems(
  controller: AbortController,
  domain: string,
  collection: string,
  phraseId: string,
  apiKey: string,
  page: number,
  from: Date | null,
  to: Date | null,
  labelsFilters: MetadataKeyValue[],
  trendPeriods: number
): Promise<{ totalPages: number; data: Item[]; error: string | null }> {
  return await fetchApi(
    controller,
    `${domain}/clustering/v1/collections/${collection}/phrases/${phraseId}/items`,
    apiKey,
    'items',
    page,
    from,
    to,
    labelsFilters,
    trendPeriods
  );
}

async function fetchApi<T>(
  controller: AbortController,
  url: string,
  apiKey: string,
  accessor: string,
  page: number,
  from: Date | null,
  to: Date | null,
  labelsFilters: MetadataKeyValue[],
  trendPeriods: number
): Promise<{ totalPages: number; data: T[]; error: string | null }> {
  const labelsFiltersString = labelsFilters
    .map((metadataKeyValue) =>
      metadataKeyValue.key && metadataKeyValue.value
        ? `${metadataKeyValue.key} eq '${metadataKeyValue.value}'`
        : ''
    )
    .filter((str) => str !== '');

  try {
    const res = await fetch(
      `${url}?page=${page}&limit=${PAGE_SIZE}` +
        (from ? `&from-date=${format(from, 'yyyy-MM-dd')}` : '') +
        (to ? `&to-date=${format(to, 'yyyy-MM-dd')}` : '') +
        (labelsFiltersString.length > 0
          ? `&item-metadata=${labelsFiltersString.join()}`
          : '') +
        (trendPeriods > 1
          ? `&include-trends=true&trend-periods-limit=${trendPeriods}`
          : ''),
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        signal: controller.signal,
      }
    );

    if (res.status !== 200 || !res.ok)
      return {
        totalPages: 0,
        data: [],
        error:
          'Error fetching data, status: ' +
          res.status +
          ': ' +
          (await res.text()),
      };

    const json = await res.json();

    return {
      totalPages: json['total_pages'],
      data: json[accessor],
      error: null,
    };
  } catch (e) {
    const error = String(e);
    console.error('error occurred ->', error);

    return {
      totalPages: 0,
      data: [],
      error: `Error fetching data, ${error}`,
    };
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

async function searchSimilarClusters(
  controller: AbortController,
  domain: string,
  collection: string,
  apiKey: string,
  text: string
): Promise<{ id: string; text: string }[]> {
  try {
    const res = await fetch(
      `${domain}/clustering/v1/collections/${collection}/clusters/find?text=${text}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        signal: controller.signal,
      }
    );

    if (res.status !== 200 || !res.ok) return [];

    const clusters = (await res.json()) as {
      cluster_id: string;
      cluster_text: string;
      similarity: number;
    }[];
    if (!clusters || clusters.length === 0) return [];

    return clusters
      .sort((c1, c2) => c2.similarity - c1.similarity)
      .map((c) => {
        return { id: c.cluster_id, text: c.cluster_text };
      });
  } catch (e) {
    console.error('error occurred ->', e);
    return [];
  }
}

async function splitPhrase(
  controller: AbortController,
  domain: string,
  collection: string,
  apiKey: string,
  phraseId: string,
  setLocalRefreshToken: React.Dispatch<React.SetStateAction<string>>
): Promise<{ status: 'Success' | 'error'; message: string }> {
  try {
    const res = await fetch(
      `${domain}/clustering/v1/collections/${collection}/phrases/${phraseId}/split`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        signal: controller.signal,
      }
    );

    if (res.status !== 200 || !res.ok)
      return { status: 'error', message: 'unknown' };

    const json = await res.json();

    if (!json.message) {
      setLocalRefreshToken((current) => {
        if (current.length > 5) {
          return '';
        }

        return current + '1';
      });
    }

    return json;
  } catch (e) {
    console.error('error occurred ->', e);
    return { status: 'error', message: String(e) };
  }
}

async function mergeClusters(
  controller: AbortController,
  domain: string,
  collection: string,
  apiKey: string,
  source: string,
  destination: string,
  setLocalRefreshToken: React.Dispatch<React.SetStateAction<string>>
): Promise<{ status: 'Success' | 'error'; message: string }> {
  try {
    const res = await fetch(
      `${domain}/clustering/v1/collections/${collection}/merge?source-cluster=${source}&destination-cluster=${destination}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        signal: controller.signal,
      }
    );

    if (res.status !== 200 || !res.ok)
      return { status: 'error', message: 'unknown' };

    const json = await res.json();

    if (!json.message) {
      setLocalRefreshToken((current) => {
        if (current.length > 5) {
          return '';
        }

        return current + '1';
      });
    }

    return json;
  } catch (e) {
    console.error('error occurred ->', e);
    return { status: 'error', message: String(e) };
  }
}
