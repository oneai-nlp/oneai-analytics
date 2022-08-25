import { FC, useEffect, useMemo, useState } from 'react';
import { treemap, hierarchy } from 'd3';
import { TreemapNode } from '../types/clusters';
import { TreemapProps } from '../types/components';
import React from 'react';
import { calculateFontSize, lightenDarkenColor } from '../common/utils';

export const Treemap: FC<TreemapProps> = ({
  clusters,
  height,
  width,
  nodeClicked,
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
    return hierarchy(mainCluster, d =>
      d.children?.sort((c1, c2) => c2.items_count - c1.items_count)
    ).sum(d => d.items_count);
  }, [mainCluster]);

  const root = useMemo(() => {
    const treeGenerator = treemap<TreemapNode>()
      .size([width, height])
      .padding(1);
    return treeGenerator(treeHierarchy);
  }, [treeHierarchy, width, height]);

  const allShapes = root.leaves().map((leaf, index) => {
    const fontSize = calculateFontSize(leaf.y1 - leaf.y0, leaf.x1 - leaf.x0);
    return (
      <g
        key={index}
        className="hover:cursor-pointer"
        onClick={() => nodeClicked(leaf.data)}
      >
        <rect
          x={leaf.x0}
          y={leaf.y0}
          width={leaf.x1 - leaf.x0}
          height={leaf.y1 - leaf.y0}
          stroke="transparent"
          fill={lightenDarkenColor('#031f38', 10 + 5 * ((index % 25) + 1))}
        />
        <foreignObject
          x={leaf.x0}
          y={leaf.y0}
          width={leaf.x1 - leaf.x0}
          height={leaf.y1 - leaf.y0}
        >
          <div className="flex flex-col h-full text-white">
            <div className="text-center flex">
              <div className="font-bold" style={{ fontSize: fontSize }}>
                {leaf.value}
              </div>
            </div>
            <div
              className="justify-center text-center items-center h-full flex"
              style={{
                fontSize: fontSize,
              }}
            >
              {leaf.data.text}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        {allShapes}
      </svg>
    </div>
  );
};
