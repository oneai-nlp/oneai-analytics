import React, { FC } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import {
  OneAiAnalyticsProps,
  TreemapDataNode,
} from '../common/types/components';
import { Cluster, Item, Phrase } from '../common/types/modals';
import { ItemsListDisplay } from './ItemsListDisplay';
import { Treemap } from './Treemap';
// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * One Ai Analytics Component
 */
export const OneAiAnalytics: FC<OneAiAnalyticsProps> = ({
  dataNodes = [],
  currentNode,
  currentPage = 0,
  totalPagesAmount = 0,
  goBackClicked = () => {},
  nodeClicked = () => {},
  nextPageClicked = () => {},
  prevPageClicked = () => {},
  itemsDisplay = ItemsListDisplay,
  treemapBigColor = '#031f38',
  treemapSmallColor = '#72b1ca',
  treemapCountFontSize = 14,
  treemapFontFamily = 'sans-serif',
  treemapTextColor = 'white',
  treemapBorderWidth = 0,
  treemapBorderColor = treemapTextColor,
  navbarColor = treemapBigColor,
}) => {
  const navBarText = currentNode
    ? currentNode.type === 'Cluster'
      ? (currentNode.data as Cluster).cluster_phrase
      : currentNode.type === 'Phrase'
      ? (currentNode.data as Phrase).text
      : (currentNode.data as Item).original_text
    : '';

  const navBarCount =
    currentNode?.type === 'Cluster'
      ? (currentNode.data as Cluster).items_count
      : currentNode?.type === 'Phrase'
      ? (currentNode.data as Phrase).items_count
      : 1;

  const treemapNodes: TreemapDataNode[] = dataNodes.map(d => {
    return {
      id: (d.type === 'Cluster'
        ? (d.data as Cluster).cluster_id
        : d.type === 'Phrase'
        ? (d.data as Phrase).phrase_id
        : (d.data as Item).original_text
      ).toString(),
      amount:
        d.type === 'Cluster'
          ? (d.data as Cluster).items_count
          : d.type === 'Phrase'
          ? (d.data as Phrase).items_count
          : 1,
      text:
        d.type === 'Cluster'
          ? (d.data as Cluster).cluster_phrase
          : d.type === 'Phrase'
          ? (d.data as Phrase).text
          : (d.data as Item).original_text,
    };
  });

  return (
    <div className="h-full w-full flex flex-col">
      {currentNode && (
        <div
          className="max-h-20 w-full"
          style={{ backgroundColor: navbarColor, height: '15%' }}
        >
          <div className="flex flex-row items-center p-5 justify-between h-full">
            <div className="flex flex-row w-11/12">
              <button
                type="button"
                onClick={goBackClicked}
                className="text-white p-2 bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center inline-flex items-center"
              >
                <svg
                  className="h-4 w-4 text-gray-500 mr-1"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {' '}
                  <path stroke="none" d="M0 0h24v24H0z" />{' '}
                  <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
                </svg>
                BACK
              </button>
              <div className="ml-4 text-gray-300 font-bold truncate self-center">
                {navBarText}
              </div>
            </div>
            <div className="text-xl text-gray-300 font-bold">{navBarCount}</div>
          </div>
        </div>
      )}

      <div
        className="w-full h-full overflow-auto"
        style={{ height: currentNode ? '85%' : '100%' }}
      >
        <div className="flex flex-row w-full h-full">
          {currentPage > 0 && (
            <div
              className="h-full flex items-center justify-center"
              style={{ width: '2%' }}
            >
              <button
                type="button"
                onClick={prevPageClicked}
                className="text-blue-500 hover:text-blue-700 font-medium rounded-lg text-sm  text-center inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 rotate-180"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Prev</span>
              </button>
            </div>
          )}

          <div className="overflow-auto h-full w-full">
            {currentNode && currentNode.type === 'Phrase' ? (
              itemsDisplay({
                items: dataNodes.map(d => (d.data as Item).original_text) ?? [],
                bgColor: treemapSmallColor,
                textColor: treemapBigColor,
              })
            ) : (
              <ContainerDimensions>
                {({ height, width }) => (
                  <Treemap
                    dataNodes={treemapNodes}
                    height={height}
                    width={width}
                    nodeClicked={node =>
                      nodeClicked({
                        type: !currentNode
                          ? 'Cluster'
                          : currentNode.type === 'Cluster'
                          ? 'Phrase'
                          : 'Item',
                        id: node.id,
                      })
                    }
                    bigColor={treemapBigColor}
                    smallColor={treemapSmallColor}
                    countFontSize={treemapCountFontSize}
                    fontFamily={treemapFontFamily}
                    textColor={treemapTextColor}
                    borderWidth={treemapBorderWidth}
                    borderColor={treemapBorderColor}
                  />
                )}
              </ContainerDimensions>
            )}
          </div>
          {currentPage < totalPagesAmount - 1 && (
            <div
              className="h-full flex items-center justify-center"
              style={{ width: '2%' }}
            >
              <button
                type="button"
                onClick={nextPageClicked}
                className="text-blue-500 hover:text-blue-700 font-medium rounded-lg text-sm  text-center inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Next</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
