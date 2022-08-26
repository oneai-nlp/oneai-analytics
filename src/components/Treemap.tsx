import { FC, useEffect, useMemo, useState } from 'react';
import { treemap, hierarchy, scaleLog } from 'd3';
import { TreemapNode } from '../types/clusters';
import { TreemapProps } from '../types/components';
import React from 'react';
import { calculateFontSize, lightenDarkenColor } from '../common/utils';

export const Treemap: FC<TreemapProps> = ({
  clusters,
  height,
  width,
  nodeClicked,
  darkestColor = '#031f38',
  countFontSize = 14,
}) => {
  const [mainCluster, setMainCluster] = useState({
    type: 'Node',
    id: '',
    children: clusters.map(c => {
      return { ...c, children: [] };
    }),
    items_count: 0,
  } as TreemapNode);

  useEffect(() => {
    setMainCluster({
      type: 'Node',
      id: '',
      children: clusters.map(c => {
        return { ...c, children: [] };
      }),
      items_count: 0,
    });
  }, [clusters]);

  const treeHierarchy = useMemo(() => {
    const elementsValues = mainCluster.children!.map(item => item.items_count);
    const maxElementValue = Math.max(...elementsValues);
    const minElementValue = Math.min(...elementsValues);
    const dataScale = scaleLog()
      .domain([minElementValue, maxElementValue])
      .range([
        Math.max(minElementValue, maxElementValue * 0.4),
        maxElementValue,
      ]);
    return hierarchy(mainCluster).sum(d => {
      return dataScale(d.items_count);
    });
  }, [mainCluster]);

  const root = useMemo(() => {
    const treeGenerator = treemap<TreemapNode>()
      .size([width, height])
      .padding(0);
    return treeGenerator(treeHierarchy);
  }, [treeHierarchy, width, height]);

  const allShapes = root.leaves().map((leaf, index) => {
    const height = leaf.y1 - leaf.y0;
    const width = leaf.x1 - leaf.x0;
    const fontSize = calculateFontSize(height, width);
    const lineHeight = fontSize * 1.1 + 5;
    const paddingY = 10;
    let lines = Math.floor((height - paddingY + 20) / lineHeight) - 3; // -2 is for the d.data.value and <br />, 20 is for the value absolute top padding
    lines = Math.max(lines, 1);
    return (
      <g
        key={index}
        className="hover:cursor-pointer"
        onClick={() => nodeClicked(leaf.data)}
      >
        <rect
          x={leaf.x0}
          y={leaf.y0}
          width={width}
          height={height}
          stroke="transparent"
          fill={lightenDarkenColor(darkestColor, 10 + 5 * ((index % 25) + 1))}
        />
        <foreignObject x={leaf.x0} y={leaf.y0} width={width} height={height}>
          <span
            className="relative h-full p-1 items-center flex justify-center text-gray-200"
            style={{ fontSize: `${fontSize}px` }}
          >
            <span
              data-element="rect-text"
              className="overflow-hidden mt-1"
              style={{
                lineHeight: `${lineHeight}px`,
                wordBreak: 'break-word',
                WebkitLineClamp: lines,
                WebkitTouchCallout: 'none',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
              }}
            >
              {leaf.data.text}
            </span>
            <span
              className="absolute top-1 left-1"
              style={{ fontSize: `${countFontSize}px` }}
            >
              {leaf.data.items_count}
            </span>
          </span>
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
