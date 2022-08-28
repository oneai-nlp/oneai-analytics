import { scale, valid } from 'chroma-js';
import { hierarchy, treemap } from 'd3';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { calculateFontSize } from '../common/utils';
import { TreemapNode } from '../types/clusters';
import { TreemapProps } from '../types/components';

const BIG_COLOR_DEFAULT = '#031f38';
const SMALL_COLOR_DEFAULT = '#72b1ca';

export const Treemap: FC<TreemapProps> = ({
  clusters,
  height,
  width,
  nodeClicked,
  bigColor = BIG_COLOR_DEFAULT,
  smallColor = SMALL_COLOR_DEFAULT,
  countFontSize = 14,
  fontFamily = 'sans-serif',
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
    const elementsSum = elementsValues.reduce(
      (a: number, b: number) => a + b,
      0
    );
    const growFactor =
      maxElementValue > elementsSum * 0.9
        ? 0.1 / (1 - maxElementValue / elementsSum)
        : 1;
    return hierarchy(mainCluster)
      .sum(d => {
        return maxElementValue === d.items_count
          ? d.items_count
          : d.items_count * growFactor;
      })
      .sort((n1, n2) => n2.data.items_count - n1.data.items_count);
  }, [mainCluster]);

  const root = useMemo(() => {
    const treeGenerator = treemap<TreemapNode>()
      .size([width, height])
      .padding(0);
    return treeGenerator(treeHierarchy);
  }, [treeHierarchy, width, height]);

  const colors = useMemo(() => {
    const len = root.leaves().length;
    if (!(valid(bigColor) && valid(smallColor)))
      return scale([BIG_COLOR_DEFAULT, SMALL_COLOR_DEFAULT]).domain([0, len]);

    return scale([bigColor, smallColor]).domain([0, len]);
  }, [root, bigColor, smallColor]);

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
          fill={colors(index).hex()}
        />
        <foreignObject x={leaf.x0} y={leaf.y0} width={width} height={height}>
          <span
            className="relative h-full p-1 items-center flex justify-center text-gray-200"
            style={{ fontSize: `${fontSize}px`, fontFamily: fontFamily }}
          >
            <span
              data-element="rect-text"
              className="overflow-hidden mt-1 text-center"
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
