import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { scale, valid } from 'chroma-js';
import { hierarchy, treemap } from 'd3';
import React, { FC, useMemo, useState } from 'react';
import { ColorsAxis } from '../common/components/CountersLabels/ColorsAxis';
import CountersLabelsDisplay from '../common/components/CountersLabelsDisplay';
import { CUSTOM_METADATA_KEY } from '../common/configurations/commonConfigurations';
import { DataNode, TreemapProps } from '../common/types/componentsInputs';
import { totalSumCalculation } from '../common/utils/countersUtils';
import { getBackgroundColorLayers } from '../common/utils/displayUtils';
import { calculateFontSize } from '../common/utils/utils';

type TreemapNode = DataNode & { children: TreemapNode[] };

const BIG_COLOR_DEFAULT = '#322F46';
const SMALL_COLOR_DEFAULT = '#2C293D';

export const Treemap: FC<TreemapProps> = ({
  dataNodes,
  nodeClicked,
  height,
  width,
  bigColor,
  smallColor,
  countFontSize = 14,
  fontFamily,
  textColor,
  borderWidth = 0,
  borderColor,
  labels,
  counters,
  countersConfiguration,
  labelClicked,
  sizeAxis,
  colorAxis,
  nodeActionsClicked,
  translate,
  totalItems,
  totalUniqueItemsStats,
  uniquePropertyName,
  itemPercentageEnabled,
  mergeMenuEnabled,
  signalsEnabled,
}) => {
  const mainNode: TreemapNode = useMemo(() => {
    return {
      id: '',
      children: dataNodes.map((c) => {
        return {
          ...c,
          amount:
            sizeAxis?.key === CUSTOM_METADATA_KEY
              ? c.amount
              : totalSumCalculation(
                  sizeAxis,
                  c.metadata,
                  c.trends,
                  countersConfiguration,
                  totalItems
                ).result,
          children: [],
        };
      }),
      amount: 0,
      metadata: {},
      trends: [],
      type: '',
      properties: {},
    };
  }, [dataNodes, sizeAxis]);

  const treeHierarchy = useMemo(() => {
    const elementsValues = mainNode.children!.map((item) => item.amount);
    const maxElementValue = Math.max(...elementsValues);
    const elementsSum = elementsValues.reduce(
      (a: number, b: number) => a + b,
      0
    );
    const growFactor =
      maxElementValue > elementsSum * 0.9
        ? 0.1 / (1 - maxElementValue / elementsSum)
        : 1;

    return hierarchy(mainNode)
      .sum((d) => {
        return maxElementValue === d.amount ? d.amount : d.amount * growFactor;
      })
      .sort((n1, n2) => n2.data.amount - n1.data.amount);
  }, [mainNode]);

  const root = useMemo(() => {
    const treeGenerator = treemap<TreemapNode>()
      .size([width, height])
      .padding(0);
    return treeGenerator(treeHierarchy);
  }, [treeHierarchy, width, height]);

  const colors = useMemo(() => {
    const len = root.leaves().length;
    if (!bigColor || !smallColor || !(valid(bigColor) && valid(smallColor)))
      return scale([BIG_COLOR_DEFAULT, SMALL_COLOR_DEFAULT]).domain([0, len]);

    return scale([bigColor, smallColor]).domain([0, len]);
  }, [root, bigColor, smallColor]);

  const [actionsVisible, setActionsVisible] = useState(null as number | null);

  const allShapes = root.leaves().map((leaf, index) => {
    const height = leaf.y1 - leaf.y0;
    const width = leaf.x1 - leaf.x0;
    const fontSize = calculateFontSize(height, width);
    const lineHeight = fontSize * 1.1 + 5;
    const paddingY = 10;
    const lines = Math.max(
      1,
      Math.floor((height - paddingY + 20) / lineHeight) - 3
    ); // -2 is for the d.data.value and <br />, 20 is for the value absolute top padding

    const colorsConfig = getBackgroundColorLayers(
      colorAxis,
      leaf.data.metadata,
      leaf.data.trends,
      countersConfiguration,
      totalItems,
      totalUniqueItemsStats,
      leaf.data.metadata_stats,
      uniquePropertyName
    );

    return (
      <g key={index}>
        <rect
          x={leaf.x0}
          y={leaf.y0}
          width={width}
          height={height}
          stroke="transparent"
          fill={colors(index).hex()}
        />
        <foreignObject x={leaf.x0} y={leaf.y0} width={width} height={height}>
          <div
            className="h-full w-full"
            onMouseEnter={() => {
              nodeActionsClicked(leaf.data);
              setActionsVisible(index);
            }}
            onMouseLeave={() => {
              setActionsVisible(null);
            }}
          >
            <ColorsAxis width={width} colorsConfig={colorsConfig} />
            <div
              className="flex flex-col h-full w-full p-1 relative border-slate-500 dark:border-[#272535] text-black dark:text-white"
              style={{
                fontFamily: fontFamily,
                fontWeight: 300,
                fontStyle: 'normal',
                color: textColor,
                borderRightWidth: `${borderWidth}px`,
                borderLeftWidth: `${borderWidth}px`,
                borderBottomWidth: `${borderWidth}px`,
                borderColor: borderColor,
              }}
            >
              {itemPercentageEnabled ? (
                <div
                  className="flex"
                  style={{
                    fontSize: `${countFontSize}px`,
                  }}
                >
                  <CountersLabelsDisplay
                    counters={counters}
                    labels={labels}
                    metadata={leaf.data.metadata}
                    trends={leaf.data.trends}
                    countersConfiguration={countersConfiguration}
                    labelClicked={labelClicked}
                    totalItems={totalItems}
                    totalUniqueItemsStats={totalUniqueItemsStats}
                    uniquePropertyName={uniquePropertyName}
                    uniqueItemsStats={leaf.data.metadata_stats}
                    signalsEnabled={signalsEnabled}
                  />
                </div>
              ) : null}
              <span
                className="items-center flex justify-center h-full hover:cursor-pointer"
                onClick={() => nodeClicked(leaf.data)}
                style={{
                  fontSize: `${fontSize}px`,
                }}
              >
                <span
                  data-element="rect-text"
                  className="overflow-hidden text-center"
                  dir="auto"
                  style={{
                    lineHeight: `${lineHeight}px`,
                    wordBreak: 'break-word',
                    WebkitLineClamp: lines,
                    WebkitTouchCallout: 'none',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {translate &&
                  leaf.data.item_translated_text !== undefined &&
                  leaf.data.item_translated_text !== null &&
                  leaf.data.item_translated_text !== ''
                    ? leaf.data.item_translated_text
                    : leaf.data.item_original_text}
                </span>
              </span>
              {mergeMenuEnabled ? (
                <div
                  data-for="global-actions"
                  data-tip
                  data-event="click"
                  className={`self-end hover:cursor-pointer hover:text-white ${
                    actionsVisible === index ? 'visible' : 'invisible'
                  }`}
                >
                  <EllipsisHorizontalIcon className="h-4 w-4" />
                </div>
              ) : null}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  });

  return (
    <svg width={width} height={height}>
      {allShapes}
    </svg>
  );
};
