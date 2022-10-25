import React, { FC, useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import ReactTooltip from 'react-tooltip';
import CountersLabelsDisplay from '../common/components/CountersLabelsDisplay';
import CustomizeTab from '../common/components/CustomizeTab';
import DatesFilters from '../common/components/DatesFilters';
import { totalSumCalculationName } from '../common/configurations/calculationsConfigurations';
import {
  labelsStorageKey,
  defaultCalculations,
  countersStorageKey,
  CUSTOM_METADATA_KEY,
} from '../common/configurations/commonConfigurations';
import { defaultCountersConfigurations } from '../common/configurations/countersConfigurations';
import {
  DataNode,
  OneAiAnalyticsProps,
} from '../common/types/componentsInputs';
import {
  CalculationConfiguration,
  CounterConfiguration,
  CountersConfigurations,
  CountersLocalStorageObject,
  CounterType,
} from '../common/types/customizeBarTypes';
import { Item, MetaData } from '../common/types/modals';
import {
  COLLECTION_TYPE,
  getNodeId,
  getNodeItemsCount,
  getNodeText,
} from '../common/utils/modalsUtils';
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
  background = '#161414',
  treemapBigColor = '#322F46',
  treemapSmallColor = '#2C293D',
  treemapCountFontSize = 14,
  treemapFontFamily = "'Poppins', sans-serif",
  treemapTextColor = 'white',
  treemapBorderWidth = 1,
  navbarColor = '#272535',
  treemapBorderColor = navbarColor,
  loading,
  nodesPath = [],
  dateRangeChanged = () => {},
  labelsFilters,
  labelClicked = () => {},
  labelFilterDeleted = () => {},
}) => {
  const [display, setDisplay] = useState('Treemap' as Displays);
  const { width, height, ref } = useResizeDetector();
  const [metaData, setMetaData] = useState({} as MetaData);
  const [nodes, setNodes] = useState([] as DataNode[]);
  const [labels, setLabels] = useState([] as string[]);
  const [counters, setCounters] = useState([] as CounterType[]);
  const [countersConfigurations, setCountersConfigurations] = useState(
    {} as CountersConfigurations
  );
  const [fromDate, setFromDate] = useState(null as Date | null);
  const [toDate, setToDate] = useState(null as Date | null);
  const loadedNodes = useRef([] as { type: string; id: string }[]);
  const currentCollection = useRef(null as string | null);

  useEffect(() => {
    if (
      !nodesPath ||
      nodesPath.length === 0 ||
      currentCollection.current === nodesPath[0]
    )
      return;

    currentCollection.current = nodesPath[0];
    setLabels(
      JSON.parse(
        localStorage.getItem(
          getCurrentStorageKey(labelsStorageKey, currentCollection.current)
        ) ?? '[]'
      )
    );

    setCounters(
      getInitialCounters(
        defaultCalculations,
        [
          {
            metadataKeyValue: { key: CUSTOM_METADATA_KEY },
            calculationName: totalSumCalculationName,
          },
        ],
        currentCollection.current
      ) as CounterType[]
    );
  }, [nodesPath]);

  useEffect(() => {
    setMetaData((currentMetadata) => {
      const newMetadata = currentNode
        ? loadedNodes.current.some(
            (loadedNode) =>
              loadedNode.type === currentNode.type &&
              loadedNode.id === getNodeId(currentNode)
          )
          ? currentMetadata
          : mergeMetadata(currentMetadata, currentNode?.data.metadata ?? {})
        : nodes
            .filter(
              (node) =>
                !loadedNodes.current.some(
                  (loadedNode) =>
                    loadedNode.id === node.id && loadedNode.type === node.type
                )
            )
            .reduce(
              (finalMetadata, currentNode) =>
                mergeMetadata(finalMetadata, currentNode.metadata),
              currentMetadata
            );
      loadedNodes.current.push({
        type: currentNode?.type ?? COLLECTION_TYPE,
        id: currentNode ? getNodeId(currentNode) : COLLECTION_TYPE,
      });

      if (!currentNode)
        loadedNodes.current.push(
          ...nodes.map((node) => {
            return { type: node.type, id: node.id };
          })
        );
      return newMetadata;
    });
  }, [currentNode, nodes]);

  useEffect(() => {
    setNodes(
      dataNodes.map((d) => {
        const itemsCount = getNodeItemsCount(d);
        return {
          id: getNodeId(d),
          amount: itemsCount,
          text: getNodeText(d),
          metadata: {
            [CUSTOM_METADATA_KEY]: [
              { value: CUSTOM_METADATA_KEY, count: itemsCount },
            ],
            ...d.data.metadata,
          },
          type: d.type,
        };
      })
    );
  }, [dataNodes]);

  useEffect(() => {
    const newCountersConfigurations: CountersConfigurations = {};
    Object.keys(metaData)
      .concat(Object.keys(defaultCountersConfigurations))
      .forEach((key) => {
        const defaultConfig = defaultCountersConfigurations[key];
        const valuesConfigured =
          defaultConfig?.items?.map((group) => group.label) ?? [];
        const counterConfiguration: CounterConfiguration = {
          label: (defaultConfig?.label ?? key).toLowerCase(),
          display: defaultConfig?.display,
          members: defaultConfig?.members ?? [{ metadataName: key }],
          isGroup: defaultConfig?.isGroup ?? false,
          items:
            key === CUSTOM_METADATA_KEY
              ? undefined
              : (
                  defaultConfig?.items?.map((group) => {
                    return {
                      label: group.label,
                      display: group.display,
                      isGroup: group.isGroup,
                      members: group.members?.map((member) => {
                        return {
                          metadataName: member.metadataName ?? key,
                          values: member.values,
                        };
                      }) ?? [
                        { metadataName: key, values: [group.label ?? ''] },
                      ],
                    };
                  }) ?? []
                ).concat(
                  metaData[key]
                    ?.filter((meta) => !valuesConfigured.includes(meta.value))
                    .map((meta) => {
                      return {
                        label: meta.value,
                        members: [{ metadataName: key, values: [meta.value] }],
                        display: undefined,
                        isGroup: false,
                      };
                    }) ?? []
                ),
        };
        newCountersConfigurations[key.toLowerCase()] = counterConfiguration;
      });

    setCountersConfigurations(newCountersConfigurations);
  }, [metaData]);

  useEffect(() => {
    const storedCounters = counters.map((counter) => {
      return {
        metadataKeyValue: counter.metadataKeyValue,
        calculationName: counter.calculationConfiguration.name,
      } as CountersLocalStorageObject;
    });

    if (currentCollection.current) {
      localStorage.setItem(
        getCurrentStorageKey(countersStorageKey, currentCollection.current),
        JSON.stringify(storedCounters)
      );
      localStorage.setItem(
        getCurrentStorageKey(labelsStorageKey, currentCollection.current),
        JSON.stringify(labels)
      );
    }
  }, [counters, labels]);

  useEffect(() => {
    dateRangeChanged(fromDate, toDate);
  }, [fromDate, toDate]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div
      className="oneai-analytics-namespace h-full w-full flex flex-col overflow-hidden"
      style={{ background: background }}
    >
      <ReactTooltip id="global" />
      <div
        className="w-full mb-1 rounded-md"
        style={{
          height: '10%',
          minHeight: '3rem',
          maxHeight: '4rem',
          background: navbarColor,
          fontFamily: treemapFontFamily,
        }}
      >
        <div className="flex flex-row items-center p-5 h-full">
          <div className="flex flex-row w-5/12 justify-start items-center">
            <div className="h-full flex">
              <svg
                className={getVisualizationLogoClasses(display === 'Treemap')}
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
                className={getVisualizationLogoClasses(display === 'BarChart')}
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
            <div>
              <CustomizeTab
                currentCounters={counters}
                selectedLabels={labels}
                countersConfigurations={countersConfigurations}
                labelsOptions={Object.keys(metaData).filter(
                  (key) => key !== CUSTOM_METADATA_KEY
                )}
                calculationsConfigurations={defaultCalculations}
                countersChanged={setCounters}
                labelsChanged={setLabels}
              />
            </div>
            <div>
              <DatesFilters
                fromDate={fromDate}
                fromDateChanged={setFromDate}
                toDate={toDate}
                toDateChanged={setToDate}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full rounded-md grow flex flex-col overflow-hidden"
        style={{ background: navbarColor }}
      >
        <div
          className="w-full"
          style={{
            height: '5%',
            minHeight: '3rem',
            maxHeight: '4rem',
            fontFamily: treemapFontFamily,
          }}
        >
          <div className="flex flex-row items-center p-5 h-full">
            <div className="flex flex-row w-10/12 justify-start">
              {currentNode && (
                <button
                  type="button"
                  onClick={() => goBackClicked(1)}
                  className="text-slate-700 hover:bg-slate-700 hover:text-white font-medium rounded-lg text-sm p-1 text-center inline-flex items-center"
                >
                  <svg
                    className="h-4 w-4 text-white"
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
                    <line x1="5" y1="12" x2="19" y2="12" />{' '}
                    <line x1="5" y1="12" x2="9" y2="16" />{' '}
                    <line x1="5" y1="12" x2="9" y2="8" />
                  </svg>
                  <span className="sr-only">Go back</span>
                </button>
              )}

              <div className="ml-4 text-gray-300 font-bold truncate self-center flex">
                {nodesPath.map((node, i) => (
                  <div key={i} className="flex">
                    <div className="max-w-[20ch] truncate">
                      <span
                        className="cursor-pointer hover:text-gray-50"
                        onClick={() => goBackClicked(nodesPath.length - 1 - i)}
                      >
                        {node}
                      </span>
                    </div>
                    {nodesPath.length - 1 !== i && (
                      <span className="ml-1 mr-1">/</span>
                    )}
                  </div>
                ))}
                {(labelsFilters?.length ?? 0) > 0 &&
                  labelsFilters
                    ?.filter((label) => label.value)
                    .map((label, i) => (
                      <span
                        key={i}
                        data-for="global"
                        data-tip="click to delete"
                        className="ml-1 text-gray-500 cursor-pointer max-w-[15ch] truncate"
                        onClick={() => {
                          labelFilterDeleted(i);
                          ReactTooltip.hide();
                        }}
                      >
                        / {label.value}
                      </span>
                    ))}
                {totalPagesAmount > 1 && currentPage > 0 && (
                  <span className="ml-1 text-gray-500">
                    / {currentPage + 1}
                  </span>
                )}
              </div>
            </div>
            <div className="flex w-2/12 justify-end">
              {!loading && (
                <CountersLabelsDisplay
                  counters={counters}
                  labels={labels}
                  metadata={nodes.reduce(
                    (finalMetadata, currentNode) =>
                      mergeMetadata(finalMetadata, currentNode.metadata),
                    {}
                  )}
                  countersConfiguration={countersConfigurations}
                  labelClicked={labelClicked}
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full grow flex flex-col overflow-x-hidden">
          {loading && (
            <div className="grow w-full justify-center items-center flex">
              <div className="text-center">
                <div role="status">
                  <svg
                    className="inline mr-2 w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          )}
          <div
            className={`flex flex-row flex-grow ${
              loading
                ? 'invisible pointer-events-none w-0 h-0'
                : 'w-full h-full'
            }`}
          >
            {currentPage > 0 && (
              <div
                className="h-full flex items-center justify-center hover:cursor-pointer"
                onClick={prevPageClicked}
                style={{ width: '3%', backgroundColor: treemapBigColor }}
              >
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-700 font-medium rounded-lg text-sm text-center inline-flex items-center"
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

            <div
              ref={ref}
              className="h-full w-full overflow-y-auto overflow-x-hidden"
            >
              {currentNode && currentNode.type === 'Phrase' ? (
                itemsDisplay({
                  items: dataNodes.map((dataNode) => dataNode.data as Item),
                  bgColor: treemapSmallColor,
                  textColor: 'white',
                  counters: counters,
                  labels: labels,
                  labelClicked: labelClicked,
                  countersConfiguration: countersConfigurations,
                })
              ) : display === 'Treemap' ? (
                <Treemap
                  dataNodes={nodes}
                  height={height ?? 0}
                  width={width ?? 0}
                  nodeClicked={(node) =>
                    nodeClicked({
                      type: !currentNode
                        ? 'Cluster'
                        : currentNode.type === 'Cluster'
                        ? 'Phrase'
                        : 'Item',
                      id: node.id,
                    })
                  }
                  labels={labels}
                  counters={counters}
                  bigColor={treemapBigColor}
                  smallColor={treemapSmallColor}
                  countFontSize={treemapCountFontSize}
                  fontFamily={treemapFontFamily}
                  textColor={treemapTextColor}
                  borderWidth={treemapBorderWidth}
                  borderColor={treemapBorderColor}
                  countersConfiguration={countersConfigurations}
                  labelClicked={labelClicked}
                />
              ) : (
                <BarChart
                  dataNodes={nodes}
                  height={height ?? 0}
                  width={width ?? 0}
                  nodeClicked={(node) =>
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
            </div>

            {currentPage < totalPagesAmount - 1 && (
              <div
                className="h-full flex items-center justify-center hover:cursor-pointer"
                onClick={nextPageClicked}
                style={{ width: '3%', backgroundColor: treemapSmallColor }}
              >
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-700 font-medium rounded-lg text-sm text-center inline-flex items-center"
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
    </div>
  );
};

function getVisualizationLogoClasses(active: boolean) {
  return `h-7 w-7   ${
    active
      ? 'text-white'
      : 'text-slate-500 hover:cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-100 hover:text-white'
  }`;
}

function mergeMetadata(metadata1: MetaData, metadata2: MetaData): MetaData {
  const newMetadata: MetaData = {};
  Array.from(
    new Set([...Object.keys(metadata1), ...Object.keys(metadata2)])
  ).forEach((key) => {
    newMetadata[key] = [...(metadata1[key] ?? []), ...(metadata2[key] ?? [])];
  });

  return newMetadata;
}

function getInitialCounters(
  calculationConfiguration: CalculationConfiguration[],
  defaultCounters: CountersLocalStorageObject[],
  collection: string
): CounterType[] {
  const storedCounters: CountersLocalStorageObject[] = JSON.parse(
    localStorage.getItem(
      getCurrentStorageKey(countersStorageKey, collection)
    ) ?? '[]'
  );
  const counters = storedCounters.length > 0 ? storedCounters : defaultCounters;

  return counters
    .map((counter) => {
      return {
        calculationConfiguration: calculationConfiguration.find(
          (calc) => calc.name === counter.calculationName
        ),
        metadataKeyValue: counter.metadataKeyValue,
      } as CounterType;
    })
    .filter((calc) => calc.calculationConfiguration !== undefined);
}

function getCurrentStorageKey(prefix: string, collection: string) {
  return `${prefix}-${collection}`;
}
