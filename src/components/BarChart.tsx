import { extent, scaleBand, scaleLinear } from 'd3';
import React, { FC, useEffect, useMemo, useState } from 'react';
import CountersLabelsDisplay from '../common/components/CountersLabelsDisplay';
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
  fontFamily = 'sans-serif',
  textColor,
  counters,
  countersConfiguration,
  labels,
  labelClicked,
  sizeAxis,
  colorAxis,
}) => {
  const barsHeight = dataNodes.length * 40;

  const [groups, setGroups] = useState([] as string[]);

  useEffect(() => {
    // Y axis is for groups since the barplot is horizontal
    setGroups(
      dataNodes
        .sort((a, b) =>
          sizeAxis?.key === CUSTOM_METADATA_KEY
            ? b.amount - a.amount
            : totalSumCalculation(sizeAxis, b.metadata, countersConfiguration)
                .result -
              totalSumCalculation(sizeAxis, a.metadata, countersConfiguration)
                .result
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
            : totalSumCalculation(sizeAxis, d.metadata, countersConfiguration)
                .result
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
    const x = xScale(0);
    const y = yScale(d.text ?? '') ?? 0;
    const result =
      sizeAxis?.key === CUSTOM_METADATA_KEY
        ? d.amount
        : totalSumCalculation(sizeAxis, d.metadata, countersConfiguration)
            .result;
    const barWidth = xScale(
      result === max ? result : Math.min(max - 1, result + max * 0.1)
    );
    const barHeight = yScale.bandwidth();
    const opacity = 0.7;
    const fill = '#72b1ca';
    const fillOpacity = 0.3;
    const rx = 1;

    const colorsConfig = getBackgroundColorLayers(
      colorAxis,
      d.metadata,
      countersConfiguration
    );

    return (
      <g
        key={i}
        className="hover:text-blue-700 hover:cursor-pointer"
        onClick={() => nodeClicked(d)}
      >
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
            style={{
              width: barWidth,
              opacity: fillOpacity,
            }}
            className="h-full absolute flex flex-col"
          >
            {colorsConfig.map((colorConfig, i) => (
              <div
                key={i}
                className="w-full grow"
                style={{
                  background: colorConfig,
                }}
              ></div>
            ))}
          </div>
          <div
            className="flex h-full items-center ml-1 relative"
            style={{
              fontFamily: fontFamily,
              fontWeight: 300,
              fontStyle: 'normal',
              color: textColor,
            }}
          >
            <span className="w-1/3 truncate">{d.text}</span>
            <span className="ml-2 w-2/3">
              <CountersLabelsDisplay
                counters={counters}
                countersConfiguration={countersConfiguration}
                labels={labels}
                metadata={d.metadata}
                labelClicked={labelClicked}
                counterWidth="6ch"
                labelWidth="15ch"
              />
            </span>
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
