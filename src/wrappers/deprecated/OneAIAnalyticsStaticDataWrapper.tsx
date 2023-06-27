import React, { FC, useEffect, useMemo, useState } from 'react';
import { PAGE_SIZE } from '../../common/configurations/commonConfigurations';
import {
  ExampleNode,
  NodeType,
  OneAIAnalyticsStaticDataWrapperProps,
  OneAIDataNode,
} from '../../common/types/componentsInputs';
import { Cluster, Item, Phrase } from '../../common/types/modals';
import { chunks } from '../../common/utils/utils';
import { OneAiAnalytics } from '../../components/OneAiAnalytics';

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * One AI Analytics static data wrapper component
 */
export const OneAIAnalyticsStaticDataWrapper: FC<
  OneAIAnalyticsStaticDataWrapperProps
> = ({ exampleNodes, collection = '', ...rest }) => {
  const [currentNodes, setCurrentNodes] = useState(
    exampleNodes as ExampleNode[]
  );
  const [clickedNodes, setClickedNodes] = useState([] as ExampleNode[]);
  const [currentPage, setCurrentPage] = useState(0);
  const currentPages = useMemo(
    () => chunks(currentNodes, PAGE_SIZE),
    [currentNodes]
  );

  useEffect(() => {
    setClickedNodes([]);
    setCurrentPage(0);
    setCurrentNodes(exampleNodes);
  }, [exampleNodes]);

  const nodeClicked = (node: { type: NodeType; id: string }) => {
    setCurrentNodes((currentClusters) => {
      const clickedNode = currentPages.at(currentPage)?.at(Number(node.id));
      if (clickedNode) {
        setClickedNodes((currentClickedCluster) => [
          ...currentClickedCluster,
          clickedNode,
        ]);
        setCurrentPage(0);
      }

      return (
        clickedNode?.children ??
        clickedNode?.items?.map((item) => {
          return { id: item, items_count: 1, text: item, type: 'Item' };
        }) ??
        currentClusters
      );
    });
  };

  const goBack = (skip: number = 0) => {
    setClickedNodes((clickedClusters) => {
      for (let i = 0; i < skip; i++) {
        clickedClusters.pop();
      }
      setCurrentPage(0);
      setCurrentNodes(clickedClusters.at(-1)?.children ?? exampleNodes);
      return [...clickedClusters];
    });
  };

  const currentClickedNode: OneAIDataNode | undefined = useMemo(() => {
    const currentClicked = clickedNodes.at(-1);
    if (currentClicked) {
      return {
        type: currentClicked.type,
        data: getNodeData(currentClicked, 0),
      } as OneAIDataNode;
    }

    return;
  }, [clickedNodes]);

  return (
    <OneAiAnalytics
      dataNodes={{
        totalItems: exampleNodes.reduce(
          (acc, node) => acc + node.items_count,
          0
        ),
        nodes:
          currentPages.at(currentPage)?.map((node, index) => {
            return { type: node.type, data: getNodeData(node, index)! };
          }) ?? [],
      }}
      currentNode={currentClickedNode}
      nodeClicked={nodeClicked}
      goBackClicked={goBack}
      currentPage={currentPage}
      totalPagesAmount={currentPages.length}
      nextPageClicked={() => setCurrentPage((page) => page + 1)}
      prevPageClicked={() => setCurrentPage((page) => page - 1)}
      nodesPath={[
        { text: collection },
        ...clickedNodes.map((node) => ({ text: node.text })),
      ]}
      {...rest}
    />
  );
};

function getNodeData(
  node: ExampleNode,
  index: number
): Cluster | Phrase | Item | undefined {
  if (node.type === 'Cluster') {
    return {
      cluster_id: index,
      cluster_phrase: node.text,
      collection: '',
      items_count: node.items_count,
      phrases_count: node.children?.length ?? 0,
      metadata: {},
    } as Cluster;
  }
  if (node.type === 'Phrase') {
    return {
      phrase_id: index,
      metadata: {},
      items_count: node.items_count,
      text: node.text,
    } as Phrase;
  }
  if (node.type === 'Item') {
    return {
      id: index,
      original_text: node.text,
      metadata: {},
    } as Item;
  }

  return;
}
