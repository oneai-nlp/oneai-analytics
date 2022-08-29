import React, { FC, useMemo } from 'react';
import { groupBy } from '../common/utils/utils';
import { OneAIAnalyticsItemsWrapperProps } from '../common/types/components';
import { TreemapNode } from '../common/types/modals';
import { ItemsListDisplay } from './ItemsListDisplay';
import { OneAiAnalytics } from './OneAiAnalytics';
// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * One Ai Analytics all items wrapper Component
 */
export const OneAIAnalyticsItemsWrapper: FC<OneAIAnalyticsItemsWrapperProps> = ({
  itemsDisplay = ItemsListDisplay,
  treemapBigColor = '#031f38',
  treemapSmallColor = '#72b1ca',
  treemapCountFontSize = 14,
  treemapFontFamily = 'sans-serif',
  treemapTextColor = 'white',
  navbarColor = treemapBigColor,
  items,
}) => {
  const treeNodes: TreemapNode[] = useMemo(() => {
    const itemsGroups = groupBy(items, i => i.phrase.id);
    const phrases: (TreemapNode & {
      clusterId: number;
      clusterText: string;
    })[] = Array.from(itemsGroups.values()).map(itemsGroup => {
      const phrase = itemsGroup[0].phrase;
      const cluster = itemsGroup[0].cluster;
      return {
        id: phrase.id.toString(),
        items_count: itemsGroup.length,
        type: 'Phrase',
        text: phrase.text,
        items: itemsGroup.map(i => i.original_text),
        clusterId: cluster.id,
        clusterText: cluster.text,
      };
    });

    const phrasesGroups = groupBy(phrases, g => g.clusterId);
    return Array.from(phrasesGroups.values()).map(phrasesGroup => {
      return {
        id: phrasesGroup[0].clusterId.toString(),
        type: 'Cluster',
        text: phrasesGroup[0].clusterText,
        items_count: phrasesGroup.reduce((a, p) => a + p.items_count, 0),
        children: phrasesGroup,
      };
    });
  }, [items]);

  return (
    <OneAiAnalytics
      clusters={treeNodes}
      itemsDisplay={itemsDisplay}
      navbarColor={navbarColor}
      treemapBigColor={treemapBigColor}
      treemapSmallColor={treemapSmallColor}
      treemapTextColor={treemapTextColor}
      treemapFontFamily={treemapFontFamily}
      treemapCountFontSize={treemapCountFontSize}
    />
  );
};
