import { format } from 'date-fns';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  NodeType,
  OneAIAnalyticsApiWrapperProps,
  OneAIDataNode,
} from '../common/types/componentsInputs';
import { MetadataKeyValue } from '../common/types/customizeBarTypes';
import {
  Cluster,
  Item,
  MetaCluster,
  Phrase,
  Properties,
} from '../common/types/modals';
import {
  COLLECTION_TYPE,
  getNodeDetails,
  getNodeId,
  getNodeOriginalAndTranslatedText,
  getNodeText,
} from '../common/utils/modalsUtils';
import { getSecondsDiff, uniqBy } from '../common/utils/utils';
import { OneAiAnalytics } from '../components/OneAiAnalytics';
import { PAGE_SIZE } from './OneAIAnalyticsStaticDataWrapper';

const cache: Map<
  string,
  { nodes: OneAIDataNode[]; totalItems: number; totalPages: number; time: Date }
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
  const [currentNodes, setCurrentNodes] = useState({
    totalItems: 0,
    nodes: [],
  } as { totalItems: number; nodes: OneAIDataNode[] });
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
  const [propertiesFilters, setPropertiesFilters] = useState({
    hide: 'true',
  } as Properties);
  const [metaOptions, setMetaOptions] = useState([] as string[]);
  const [currentMetaGroup, setCurrentMetaGroup] = useState('text');
  const [metaGroupClicked, setMetaGroupClicked] = useState(
    null as MetadataKeyValue | null
  );
  const runOnce = useRef(false);

  useEffect(() => {
    if (runOnce.current) return;
    runOnce.current = true;
    fetchMetaClusters();
  }, []);

  const previousValues = useRef({
    domain: null as string | null,
    apiKey: null as string | null,
    collection: null as string | null,
    refreshToken: null as string | null,
    localRefreshToken: null as string | null,
    clickedNodes: null as OneAIDataNode[] | null,
    currentPage: null as number | null,
    lastMetaGroup: 'text' as string,
  });

  const fetchMetaClusters = async () => {
    const controller = new AbortController();

    const metaClusters = await fetchMetaClustersApi(
      controller,
      domain,
      collection,
      apiKey,
      currentPage,
      dateRange[0],
      dateRange[1],
      labelsFilters,
      trendPeriods,
      propertiesFilters
    );

    const newNodes = metaClusters.data.map((c) => {
      return { type: 'Meta' as NodeType, data: c };
    });

    const mappedNodes = newNodes.map((n) => n.data.meta_key);
    setMetaOptions(mappedNodes);
  };

  useEffect(() => {
    if (
      previousValues.current.domain !== domain ||
      previousValues.current.apiKey !== apiKey ||
      previousValues.current.collection !== collection ||
      previousValues.current.refreshToken !== refreshToken ||
      previousValues.current.localRefreshToken !== localRefreshToken ||
      previousValues.current.lastMetaGroup !== currentMetaGroup
    ) {
      setCurrentNodes({ totalItems: 0, nodes: [] });
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
        lastMetaGroup: currentMetaGroup,
      };
    }
  }, [
    domain,
    apiKey,
    collection,
    refreshToken,
    localRefreshToken,
    currentMetaGroup,
  ]);

  useEffect(() => {
    const fetchData = async (controller: AbortController) => {
      setLoading(true);
      const currentClicked = clickedNodes.at(-1);

      if (currentMetaGroup !== 'text' && !currentClicked) {
        const cached = getNodesFromCache(
          COLLECTION_TYPE,
          collection + '_meta',
          currentPage
        );

        if (cached) {
          const newNodes = cached.nodes.map((n) => n.data as MetaCluster);
          if (currentMetaGroup !== 'text') {
            setTotalPages(1);
            const filteredNodes = newNodes.filter(
              (n) => n.meta_key === currentMetaGroup
            );
            setCurrentNodes({
              totalItems: filteredNodes.reduce(
                (acc, curr) => acc + curr.items_count,
                0
              ),
              nodes: filteredNodes.map((c) => {
                return { type: 'Meta' as NodeType, data: c };
              }),
            });
          }
        } else {
          const metaClusters = await fetchMetaClustersApi(
            controller,
            domain,
            collection,
            apiKey,
            currentPage,
            dateRange[0],
            dateRange[1],
            labelsFilters,
            trendPeriods,
            propertiesFilters
          );
          if (metaClusters.error) {
            if (metaClusters.error.includes('AbortError')) {
              return;
            }

            setError(metaClusters.error);
            return setLoading(false);
          }
          setError(null);

          const newNodes = metaClusters.data.map((c) => {
            return { type: 'Meta' as NodeType, data: c };
          });

          const mappedNodes = newNodes.map((n) => n.data as MetaCluster);
          setTotalPages(1);
          const filteredNodes = mappedNodes.filter(
            (n) => n.meta_key === currentMetaGroup
          );
          setCurrentNodes({
            totalItems: filteredNodes.reduce(
              (acc, curr) => acc + curr.items_count,
              0
            ),
            nodes: filteredNodes.map((c) => {
              return { type: 'Meta' as NodeType, data: c };
            }),
          });

          setNodesDataInCache(
            'Collection',
            collection + '_meta',
            currentPage,
            newNodes,
            1,
            metaClusters.totalItems
          );
        }
      } else if (!currentClicked) {
        const cached = getNodesFromCache(
          COLLECTION_TYPE,
          collection,
          currentPage
        );
        if (cached) {
          setTotalPages(cached.totalPages);
          setCurrentNodes({
            totalItems: cached.totalItems,
            nodes: cached.nodes,
          });
        } else {
          const clusters = await fetchClusters(
            controller,
            domain,
            collection,
            apiKey,
            currentPage,
            dateRange[0],
            dateRange[1],
            [...labelsFilters, ...(metaGroupClicked ? [metaGroupClicked] : [])],
            trendPeriods,
            propertiesFilters
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
            setCurrentNodes({
              totalItems: clusters.totalItems,
              nodes: newNodes,
            });
            setTotalPages(clusters.totalPages);
          }

          setNodesDataInCache(
            'Collection',
            collection,
            currentPage,
            newNodes,
            clusters.totalPages,
            clusters.totalItems
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
          setCurrentNodes({
            totalItems: cached.totalItems,
            nodes: cached.nodes,
          });
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
            [...labelsFilters, ...(metaGroupClicked ? [metaGroupClicked] : [])],
            trendPeriods,
            propertiesFilters
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
            setCurrentNodes({
              totalItems: phrases.totalItems,
              nodes: newNodes,
            });
            setTotalPages(phrases.totalPages);
          }
          setNodesDataInCache(
            currentClicked.type,
            clusterId,
            currentPage,
            newNodes,
            phrases.totalPages,
            phrases.totalItems
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
          setCurrentNodes({
            totalItems: cached.totalItems,
            nodes: cached.nodes,
          });
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
            [...labelsFilters, ...(metaGroupClicked ? [metaGroupClicked] : [])],
            trendPeriods,
            propertiesFilters
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
            setCurrentNodes({ totalItems: items.totalItems, nodes: newNodes });
            setTotalPages(items.totalPages);
          }

          setNodesDataInCache(
            currentClicked.type,
            phraseId,
            currentPage,
            newNodes,
            items.totalPages,
            items.totalItems
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
      previousValues.current.currentPage !== currentPage ||
      previousValues.current.lastMetaGroup !== currentMetaGroup
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
        lastMetaGroup: currentMetaGroup,
      };
    }

    return () => {
      controller.abort();
    };
  }, [domain, collection, apiKey, clickedNodes, currentPage, currentMetaGroup]);

  const nodeClicked = (node: { type: NodeType; id: string }) => {
    const currentNodeDetails = getNodeDetails(clickedNodes.at(-1), collection);

    if (currentMetaGroup !== 'text') {
      return setLocalRefreshToken((current) => {
        const [key, value] = node.id.split('$$');
        setMetaGroupClicked({ key, value });
        setCurrentMetaGroup('text');
        return current.length > 2 ? '1' : current + '1';
      });
    }

    setNodePageNumberInCache(
      currentNodeDetails.type,
      currentNodeDetails.id,
      currentPage
    );
    let clickedNode: OneAIDataNode | null = null;
    if (node.type === 'Cluster') {
      clickedNode =
        currentNodes.nodes.find(
          (n) => (n.data as Cluster).cluster_id.toString() === node.id
        ) ?? null;
    } else if (node.type === 'Phrase') {
      clickedNode =
        currentNodes.nodes.find(
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
    if (skip === 0) {
      if (currentMetaGroup !== 'text') {
        setMetaGroupClicked(null);
        setCurrentMetaGroup('text');
      }
      return;
    }

    setClickedNodes((clickedClusters) => {
      const originalClickedAmount = clickedClusters.length;
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
      const extraBackNodes = originalClickedAmount - skip;
      if (extraBackNodes < 0) {
        setLocalRefreshToken((current) => {
          if (extraBackNodes === -1) {
            setCurrentMetaGroup(metaGroupClicked?.key ?? 'text');
            setMetaGroupClicked(null);
          } else {
            setMetaGroupClicked(null);
            setCurrentMetaGroup('text');
          }
          return current.length > 2 ? '1' : current + '1';
        });
      }
      return [...clickedClusters];
    });
  };

  return currentNodes ? (
    <OneAiAnalytics
      dataNodes={currentNodes ?? { totalItems: 0, nodes: [] }}
      currentNode={clickedNodes.at(-1)}
      nodeClicked={nodeClicked}
      goBackClicked={goBack}
      currentPage={currentPage}
      totalPagesAmount={totalPages}
      nextPageClicked={() => setCurrentPage((page) => page + 1)}
      prevPageClicked={() => setCurrentPage((page) => page - 1)}
      loading={loading}
      error={error}
      nodesPath={[
        { text: collection },
        ...(metaGroupClicked
          ? [
              { text: metaGroupClicked.key },
              { text: metaGroupClicked.value ?? '' },
            ]
          : []),
        ...clickedNodes.map((node) => {
          const { originalText, translatedText } =
            getNodeOriginalAndTranslatedText(node);
          return {
            text: originalText ?? getNodeText(node),
            translated: translatedText,
          };
        }),
      ]}
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
            (keyValue) =>
              keyValue.key.toLowerCase() === key.toLowerCase() &&
              keyValue.value?.toLowerCase() === value.toLowerCase()
          )
        )
          setLocalRefreshToken((current) => {
            setLabelsFilters((labels) => [...labels, { key, value }]);
            return current.length > 2 ? '1' : current + '1';
          });
      }}
      labelFilterDeleted={(i) =>
        setLocalRefreshToken((current) => {
          setLabelsFilters((filters) => {
            filters.splice(i, 1);
            return [...filters];
          });
          return current.length > 2 ? '1' : current + '1';
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
      toggleHide={(node, hide) =>
        toggleHide(
          domain,
          collection,
          apiKey,
          node,
          hide,
          clickedNodes.at(-1),
          setLocalRefreshToken
        )
      }
      propertiesFilters={propertiesFilters}
      setPropertiesFilters={(properties) =>
        setLocalRefreshToken((current) => {
          setPropertiesFilters(properties);
          return current.length > 2 ? '1' : current + '1';
        })
      }
      metaOptions={['text', ...uniqBy(metaOptions, (m) => m.toLowerCase())]}
      currentMetaOption={currentMetaGroup}
      metaOptionsChanged={(metaOptions) => setCurrentMetaGroup(metaOptions)}
      refresh={() =>
        setLocalRefreshToken((current) => {
          return current.length > 2 ? '1' : current + '1';
        })
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
  trendPeriods: number,
  propertiesFilters: Properties
): Promise<{
  totalPages: number;
  totalItems: number;
  data: Cluster[];
  error: string | null;
}> {
  return await fetchApi(
    controller,
    `${domain}/clustering/v1/collections/${collection}/clusters`,
    apiKey,
    'clusters',
    page,
    from,
    to,
    labelsFilters,
    trendPeriods,
    propertiesFilters
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
  trendPeriods: number,
  propertiesFilters: Properties
): Promise<{
  totalPages: number;
  totalItems: number;
  data: Phrase[];
  error: string | null;
}> {
  return await fetchApi(
    controller,
    `${domain}/clustering/v1/collections/${collection}/clusters/${clusterId}/phrases`,
    apiKey,
    'phrases',
    page,
    from,
    to,
    labelsFilters,
    trendPeriods,
    propertiesFilters
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
  trendPeriods: number,
  propertiesFilters: Properties
): Promise<{
  totalPages: number;
  totalItems: number;
  data: Item[];
  error: string | null;
}> {
  return await fetchApi(
    controller,
    `${domain}/clustering/v1/collections/${collection}/phrases/${phraseId}/items`,
    apiKey,
    'items',
    page,
    from,
    to,
    labelsFilters,
    trendPeriods,
    propertiesFilters
  );
}

async function fetchMetaClustersApi(
  controller: AbortController,
  domain: string,
  collection: string,
  apiKey: string,
  page: number,
  from: Date | null,
  to: Date | null,
  labelsFilters: MetadataKeyValue[],
  trendPeriods: number,
  propertiesFilters: Properties
): Promise<{
  totalPages: number;
  totalItems: number;
  data: MetaCluster[];
  error: string | null;
}> {
  return await fetchApi(
    controller,
    `${domain}/clustering/v1/collections/${collection}/metadata`,
    apiKey,
    'content',
    page,
    from,
    to,
    labelsFilters,
    trendPeriods,
    propertiesFilters,
    '&group-by-meta-value=true'
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
  trendPeriods: number,
  propertiesFilters: Properties,
  extraParams?: string
): Promise<{
  totalPages: number;
  totalItems: number;
  data: T[];
  error: string | null;
}> {
  const labelsFiltersString = labelsFilters
    .map((metadataKeyValue) =>
      metadataKeyValue.key && metadataKeyValue.value
        ? `${metadataKeyValue.key} eq '${metadataKeyValue.value}'`
        : ''
    )
    .filter((str) => str !== '');

  const propertiesFiltersString = Object.keys(propertiesFilters).map((key) => {
    const value = propertiesFilters[key];
    if (value) {
      return `${key} neq '${value}'`;
    }

    return '';
  });

  try {
    const res = await fetch(
      encodeURI(
        `${url}?page=${page}&limit=${PAGE_SIZE}&translate=true` +
          (from ? `&from-date=${format(from, 'yyyy-MM-dd')}` : '') +
          (to ? `&to-date=${format(to, 'yyyy-MM-dd')}` : '') +
          (labelsFiltersString.length > 0
            ? `&item-metadata=${labelsFiltersString.join(' and ')}`
            : '') +
          (trendPeriods > 1
            ? `&include-trends=true&trend-periods-limit=${trendPeriods}`
            : '') +
          (propertiesFiltersString.length > 0
            ? `&properties-query=${propertiesFiltersString.join(' and ')}`
            : '') +
          (extraParams ? extraParams : '')
      ),
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        signal: controller.signal,
      }
    );

    if (res.status !== 200 || !res.ok)
      return {
        totalPages: 0,
        totalItems: 0,
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
      totalItems: json['total_items'],
      data: json[accessor],
      error: null,
    };
  } catch (e) {
    const error = String(e);
    console.error('error occurred ->', error);

    return {
      totalPages: 0,
      totalItems: 0,
      data: [],
      error: `Error fetching data, ${error}`,
    };
  }
}

function getNodesFromCache(
  parentType: string,
  parentId: string,
  page: number
): {
  nodes: OneAIDataNode[];
  totalItems: number;
  totalPages: number;
  time: Date;
} | null {
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
  totalPages: number,
  totalItems: number
) {
  cache.set(assembleCacheId(parentType, parentId, page), {
    nodes: nodes,
    totalPages: totalPages,
    time: new Date(),
    totalItems: totalItems,
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
): Promise<
  { id: string; text: string; translation: string | null | undefined }[]
> {
  try {
    const res = await fetch(
      `${domain}/clustering/v1/collections/${collection}/clusters/find?text=${text}&translate=true`,
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
      item_original_text: string;
      item_translated_text?: null | string;
    }[];
    if (!clusters || clusters.length === 0) return [];

    return clusters
      .sort((c1, c2) => c2.similarity - c1.similarity)
      .map((c) => {
        return {
          id: c.cluster_id,
          text: c.cluster_text,
          translation: c.item_translated_text,
        };
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
  source: string[],
  destination: string,
  setLocalRefreshToken: React.Dispatch<React.SetStateAction<string>>
): Promise<{ status: 'Success' | 'error'; message: string }> {
  try {
    const res = await fetch(
      `${domain}/clustering/v1/collections/${collection}/merge`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          source_clusters: source,
          destination_cluster: destination,
        }),
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

async function toggleHide(
  domain: string,
  collection: string,
  apiKey: string,
  node: {
    type: NodeType;
    id: string;
    text: string;
    properties: Properties;
  } | null,
  hide: string,
  currentClickedNode: OneAIDataNode | null | undefined,
  setLocalRefreshToken: React.Dispatch<React.SetStateAction<string>>
): Promise<void> {
  if (!node) return;
  try {
    const clusterId =
      node.type === 'Cluster' ? node.id : getNodeId(currentClickedNode!);
    const res = await fetch(
      `${domain}/clustering/v1/collections/${collection}/clusters/${clusterId}${
        node.type === 'Phrase' ? `/phrases/${node.id}` : ''
      }/settings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          properties: {
            hide: hide,
          },
        }),
      }
    );

    if (res.status !== 200 || !res.ok) return;

    setLocalRefreshToken((current) => {
      if (current.length > 5) {
        return '';
      }

      return current + '1';
    });
  } catch (e) {
    console.error('error occurred ->', e);
  }
}
