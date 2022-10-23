import { scale, valid } from 'chroma-js';
import { hierarchy, treemap } from 'd3';
import React, { FC, useMemo } from 'react';
import CountersLabelsDisplay from '../common/components/CountersLabelsDisplay';
import { DataNode, TreemapProps } from '../common/types/componentsInputs';
import { calculateFontSize } from '../common/utils/utils';

type TreemapNode = DataNode & { children: TreemapNode[] };

const BIG_COLOR_DEFAULT = '#031f38';
const SMALL_COLOR_DEFAULT = '#72b1ca';

export const Treemap: FC<TreemapProps> = ({
  dataNodes,
  nodeClicked,
  height,
  width,
  bigColor = BIG_COLOR_DEFAULT,
  smallColor = SMALL_COLOR_DEFAULT,
  countFontSize = 14,
  fontFamily = 'sans-serif',
  textColor = 'white',
  borderWidth = 0,
  borderColor = bigColor,
  labels,
  counters,
  countersConfiguration,
  labelClicked,
}) => {
  const mainNode: TreemapNode = useMemo(() => {
    return {
      id: '',
      children: dataNodes.map((c) => {
        return { ...c, children: [] };
      }),
      amount: 0,
      metadata: {},
      type: '',
    };
  }, [dataNodes]);

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
    const treeGenerator = treemap<DataNode>().size([width, height]).padding(0);
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
    const lines = Math.max(
      1,
      Math.floor((height - paddingY + 20) / lineHeight) - 3
    ); // -2 is for the d.data.value and <br />, 20 is for the value absolute top padding

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
            className="flex flex-col h-full w-full p-1"
            style={{
              fontFamily: fontFamily,
              fontWeight: 300,
              fontStyle: 'normal',
              color: textColor,
              borderWidth: `${borderWidth}px`,
              borderColor: borderColor,
            }}
          >
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
                countersConfiguration={countersConfiguration}
                labelClicked={labelClicked}
              />
            </div>
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
