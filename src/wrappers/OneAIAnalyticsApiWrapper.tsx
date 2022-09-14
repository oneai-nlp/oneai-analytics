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

          setCurrentNodes(newNodes);
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
          setCurrentNodes(newNodes);
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

          setCurrentNodes(newNodes);
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
      {loading && (
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            WebkitTransform: 'translate(-50%,-50%)',
          }}
        >
          <div role="status">
            <svg
              className="inline mr-2 w-8 h-8 text-gray-200 animate-spin fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div
        className={`h-full w-full ${
          loading ? 'opacity-20 pointer-events-none' : ''
        }`}
      >
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
          {...rest}
        />
      </div>
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
    apiKey
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
    apiKey
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
    apiKey
  );
}

async function fetchApi<T>(url: string, apiKey: string): Promise<T[]> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    });

    if (res.status !== 200) return [];

    return await res.json();
  } catch (e) {
    console.error('error occurred', e);
  }

  return [];
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
