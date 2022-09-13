import { extent, scaleBand, scaleLinear } from 'd3';
import React, { FC, useMemo } from 'react';
import { BarChartProps } from '../common/types/components';

const BAR_PADDING = 0.1;

export const BarChart: FC<BarChartProps> = ({
  dataNodes,
  height,
  width,
  nodeClicked,
  fontFamily = 'sans-serif',
}) => {
  const barsHeight = dataNodes.length * 25;
  // Y axis is for groups since the barplot is horizontal
  const groups = dataNodes
    .sort((a, b) => b.amount - a.amount)
    .map(d => d.text ?? '');

  const yScale = useMemo(() => {
    return scaleBand()
      .domain(groups)
      .range([0, barsHeight])
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
    const x = xScale(0);
    const y = yScale(d.text ?? '') ?? 0;
    const width = xScale(
      d.amount === max ? d.amount : Math.min(max - 1, d.amount + max * 0.1)
    );
    const height = yScale.bandwidth();
    const opacity = 0.7;
    const stroke = '#72b1ca';
    const fill = '#72b1ca';
    const fillOpacity = 0.3;
    const strokeWidth = 1;
    const rx = 1;
    return (
      <g
        key={i}
        className="hover:text-blue-700 hover:cursor-pointer"
        onClick={() => nodeClicked(d)}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          opacity={opacity}
          stroke={stroke}
          fill={fill}
          fillOpacity={fillOpacity}
          strokeWidth={strokeWidth}
          rx={rx}
        />
        <foreignObject
          x={x}
          y={y}
          width={width}
          height={height}
          opacity={opacity}
          stroke={stroke}
          fill={fill}
          fillOpacity={fillOpacity}
          strokeWidth={strokeWidth}
          rx={rx}
        >
          <div
            className="flex h-full items-center"
            style={{ fontFamily: fontFamily, color: 'white' }}
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
    <svg width={width} height={barsHeight}>
      {allShapes}
    </svg>
  );
};
