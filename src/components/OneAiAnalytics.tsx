import React, { FC, useState } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import { OneAiAnalyticsProps, DataNode } from '../common/types/components';
import { Cluster, Item, Phrase } from '../common/types/modals';
import { BarChart } from './BarChart';
import { ItemsListDisplay } from './ItemsListDisplay';
import { Treemap } from './Treemap';

export type Displays = 'Treemap' | 'BarChart';

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
  background = '#2C293D',
  treemapBigColor = '#031f38',
  treemapSmallColor = '#2C293D',
  treemapCountFontSize = 14,
  treemapFontFamily = 'sans-serif',
  treemapTextColor = 'white',
  treemapBorderWidth = 1,
  treemapBorderColor = '#2C161D',
  navbarColor = treemapBigColor,
}) => {
  const [display, setDisplay] = useState('Treemap' as Displays);

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

  const nodes: DataNode[] = dataNodes.map(d => {
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
    <div
      className="h-full w-full flex flex-col"
      style={{ background: background }}
    >
      <div
        className="max-h-20 w-full"
        style={{ backgroundColor: navbarColor, height: '15%' }}
      >
        <div className="flex flex-row items-center p-5 justify-between h-full">
          <div className="flex flex-row w-11/12">
            {currentNode && (
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
            )}

            <div className="ml-4 text-gray-300 font-bold truncate self-center">
              {navBarText}
            </div>
          </div>
          <div className="flex">
            <svg
              className="h-8 w-8 text-teal-500 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300"
              onClick={() => setDisplay('Treemap')}
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
              <rect x="4" y="4" width="16" height="16" rx="2" />{' '}
              <line x1="4" y1="10" x2="20" y2="10" />{' '}
              <line x1="10" y1="4" x2="10" y2="20" />
            </svg>

            <svg
              className="h-8 w-8 text-teal-500  hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:text-indigo-500 duration-300"
              onClick={() => setDisplay('BarChart')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          {currentNode && (
            <div className="text-xl text-gray-300 font-bold">{navBarCount}</div>
          )}
        </div>
      </div>

      <div className="w-full h-full overflow-auto" style={{ height: '85%' }}>
        <div className="flex flex-row w-full h-full">
          {currentPage > 0 && (
            <div
              className="h-full flex items-center justify-center hover:cursor-pointer"
              onClick={prevPageClicked}
              style={{ width: '3%' }}
            >
              <button
                type="button"
                className="text-slate-500 hover:text-slate-700 font-medium rounded-lg text-sm  text-center inline-flex items-center"
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
                textColor: 'white',
              })
            ) : (
              <ContainerDimensions>
                {({ height, width }) => (
                  <>
                    {display === 'Treemap' ? (
                      <Treemap
                        dataNodes={nodes}
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
                    ) : (
                      <BarChart
                        dataNodes={nodes}
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
                        fontFamily={treemapFontFamily}
                        textColor={treemapTextColor}
                      />
                    )}
                  </>
                )}
              </ContainerDimensions>
            )}
          </div>
          {currentPage < totalPagesAmount - 1 && (
            <div
              className="h-full flex items-center justify-center hover:cursor-pointer"
              onClick={nextPageClicked}
              style={{ width: '3%' }}
            >
              <button
                type="button"
                className="text-slate-500 hover:text-slate-700 font-medium rounded-lg text-sm  text-center inline-flex items-center"
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
