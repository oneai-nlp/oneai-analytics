import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { extent, scaleBand, scaleLinear } from 'd3';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { ColorsAxis } from '../common/components/CountersLabels/ColorsAxis';
import CounterDisplay from '../common/components/CountersLabels/CounterDisplay';
import MaxLabelDisplay from '../common/components/CountersLabels/MaxLabelDisplay';
import { CUSTOM_METADATA_KEY } from '../common/configurations/commonConfigurations';
import { BarChartProps } from '../common/types/componentsInputs';
import { totalSumCalculation } from '../common/utils/countersUtils';
import { getBackgroundColorLayers } from '../common/utils/displayUtils';

const BAR_PADDING = 0.1;

export const BarChart: FC<BarChartProps> = ({
  dataNodes,
  height,
  width,
  nodeClicked,
  barColor,
  fontFamily,
  textColor,
  counters,
  countersConfiguration,
  labels,
  labelClicked,
  sizeAxis,
  colorAxis,
  translate,
  totalItems,
  nodeActionsClicked,
  totalUniqueItemsStats,
  uniquePropertyName,
}) => {
  const [actionsVisible, setActionsVisible] = useState(null as number | null);
  const barsHeight = dataNodes.length * 40;

  const [groups, setGroups] = useState([] as string[]);

  useEffect(() => {
    // Y axis is for groups since the barplot is horizontal
    setGroups(
      dataNodes
        .sort((a, b) =>
          sizeAxis?.key === CUSTOM_METADATA_KEY
            ? b.amount - a.amount
            : totalSumCalculation(
                sizeAxis,
                b.metadata,
                b.trends,
                countersConfiguration,
                totalItems
              ).result -
              totalSumCalculation(
                sizeAxis,
                a.metadata,
                b.trends,
                countersConfiguration,
                totalItems
              ).result
        )
        .map((d) => d.text ?? '')
    );
  }, [dataNodes, sizeAxis]);

  const yScale = useMemo(() => {
    return scaleBand()
      .domain(groups)
      .range([0, barsHeight])
      .padding(BAR_PADDING);
  }, [height, groups]);

  const max = useMemo(
    () =>
      extent(
        dataNodes.map((d) =>
          sizeAxis?.key === CUSTOM_METADATA_KEY
            ? d.amount
            : totalSumCalculation(
                sizeAxis,
                d.metadata,
                d.trends,
                countersConfiguration,
                totalItems
              ).result
        )
      )[1] ?? 20,
    [dataNodes, sizeAxis]
  );

  // X axis
  const xScale = useMemo(() => {
    return scaleLinear()
      .domain([0, max || 10])
      .range([0, width]);
  }, [width, max]);

  // Build the shapes
  const allShapes = dataNodes.map((d, i) => {
    const x = 24;
    const y = yScale(d.text ?? '') ?? 0;
    const result =
      sizeAxis?.key === CUSTOM_METADATA_KEY
        ? d.amount
        : totalSumCalculation(
            sizeAxis,
            d.metadata,
            d.trends,
            countersConfiguration,
            totalItems
          ).result;
    const xWidth =
      xScale(result === max ? result : Math.min(max - 1, result + max * 0.1)) -
      24;
    const barWidth = xWidth > 0 ? xWidth : 0;
    const barHeight = 36;
    const opacity = 1;
    const fill = barColor;
    const fillOpacity = 1;
    const rx = 1;

    const colorsConfig = getBackgroundColorLayers(
      colorAxis,
      d.metadata,
      d.trends,
      countersConfiguration,
      totalItems,
      totalUniqueItemsStats,
      d.metadata_stats,
      uniquePropertyName
    );

    return (
      <g key={i}>
        <rect
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          opacity={opacity}
          fill={fill}
          fillOpacity={fillOpacity}
          rx={rx}
        />
        <foreignObject
          x={x}
          y={y}
          width={width}
          height={barHeight}
          opacity={opacity}
          fill={fill}
          fillOpacity={fillOpacity}
          rx={rx}
        >
          <div
            className="h-full w-full"
            onMouseEnter={() => {
              nodeActionsClicked(d);
              setActionsVisible(i);
            }}
            onMouseLeave={() => {
              setActionsVisible(null);
            }}
          >
            <ColorsAxis width={barWidth} colorsConfig={colorsConfig} />
            <div
              className="flex h-full w-full items-center ml-1 relative text-gray-500"
              style={{
                fontFamily: fontFamily,
                fontWeight: 300,
                fontStyle: 'normal',
                color: textColor,
                fontSize: '14px',
              }}
            >
              <span className="flex items-center max-w-[30%] truncate mr-2">
                {counters
                  .filter((counter) => counter.metadataKeyValue !== null)
                  .map((counter, i) => (
                    <div key={i} className="ml-1">
                      <CounterDisplay
                        counter={counter}
                        countersConfiguration={countersConfiguration}
                        metadata={d.metadata}
                        trends={d.trends}
                        width="6ch"
                        totalItems={totalItems}
                        totalUniqueItemsStats={totalUniqueItemsStats}
                        uniquePropertyName={uniquePropertyName}
                        uniqueItemsStats={d.metadata_stats}
                      />
                    </div>
                  ))}
              </span>
              <span
                className="truncate w-3/6 hover:text-gray-400 dark:hover:text-gray-300 hover:cursor-pointer"
                onClick={() => nodeClicked(d)}
                dir="auto"
              >
                {translate &&
                d.item_translated_text !== undefined &&
                d.item_translated_text !== null &&
                d.item_translated_text !== ''
                  ? d.item_translated_text
                  : d.item_original_text}
              </span>
              <span className="truncate flex items-center w-2/6 ml-auto">
                {labels.map((label, i) => (
                  <div key={i}>
                    <MaxLabelDisplay
                      countersConfiguration={countersConfiguration}
                      metadataKey={label}
                      labelClicked={labelClicked}
                      metadata={d.metadata}
                      width="15ch"
                    />
                  </div>
                ))}
              </span>
              <div
                data-for="global-actions"
                data-tip
                data-event="click"
                className={`self-end mr-1 hover:cursor-pointer hover:text-white ${
                  actionsVisible === i ? 'visible' : 'invisible'
                }`}
              >
                <EllipsisHorizontalIcon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </foreignObject>
      </g>
    );
  });

  return (
    <svg width={width} height={barsHeight}>
      {allShapes}
    </svg>
  );
};
