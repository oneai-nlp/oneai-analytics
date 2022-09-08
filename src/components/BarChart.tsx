import { extent, scaleBand, scaleLinear } from 'd3';
import React, { FC, useMemo } from 'react';
import { BarChartProps } from '../common/types/components';

const BAR_PADDING = 0.2;

export const BarChart: FC<BarChartProps> = ({
  dataNodes,
  height,
  width,
  nodeClicked,
  fontFamily = 'sans-serif',
  textColor = 'white',
}) => {
  console.log(textColor);
  // Y axis is for groups since the barplot is horizontal
  const groups = dataNodes
    .sort((a, b) => b.amount - a.amount)
    .map(d => d.text ?? '');
  const yScale = useMemo(() => {
    return scaleBand()
      .domain(groups)
      .range([0, height])
      .padding(BAR_PADDING);
  }, [height, groups]);

  const max = useMemo(() => extent(dataNodes.map(d => d.amount))[1] ?? 20, [
    dataNodes,
  ]);

  // X axis
  const xScale = useMemo(() => {
    return scaleLinear()
      .domain([0, max || 10])
      .range([0, width]);
  }, [width, max]);

  // Build the shapes
  const allShapes = dataNodes.map((d, i) => {
    return (
      <g
        key={i}
        className="hover:text-blue-700 hover:cursor-pointer"
        onClick={() => nodeClicked(d)}
      >
        <rect
          x={xScale(0)}
          y={yScale(d.text ?? '')}
          width={xScale(
            d.amount === max
              ? d.amount
              : Math.min(max - 1, d.amount + max * 0.1)
          )}
          height={yScale.bandwidth()}
          opacity={0.7}
          stroke="#72b1ca"
          fill="#72b1ca"
          fillOpacity={0.3}
          strokeWidth={1}
          rx={1}
        />
        <foreignObject
          x={xScale(0)}
          y={yScale(d.text ?? '')}
          width={xScale(
            d.amount === max
              ? d.amount
              : Math.min(max - 1, d.amount + max * 0.1)
          )}
          height={yScale.bandwidth()}
          opacity={0.7}
          stroke="#72b1ca"
          fill="#72b1ca"
          fillOpacity={0.3}
          strokeWidth={1}
          rx={1}
        >
          <div
            className="flex h-full items-center"
            style={{ fontFamily: fontFamily }}
          >
            <span className="truncate">
              {d.amount} - {d.text}
            </span>
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
