import { HomeIcon, XMarkIcon } from '@heroicons/react/20/solid';
import {
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import ReactTooltip from 'react-tooltip';
import LabelDisplay from '../common/components/CountersLabels/LabelDisplay';
import LabelsFiltersSelect from '../common/components/CountersLabels/LabelsFiltersSelect';
import SingleSelect from '../common/components/CountersLabels/SingleSelect';
import CountersLabelsDisplay from '../common/components/CountersLabelsDisplay';
import CustomizeTab from '../common/components/CustomizeTab';
import DatesFilters from '../common/components/DatesFilters';
import ItemActions from '../common/components/ItemActions';
import {
  percentOfItemsCalculationName,
  percentOfTotalUniqueItemsCalculationName,
  topGroupPercentCalculationName,
  totalUniqueItemsCalculationName,
} from '../common/configurations/calculationsConfigurations';
import {
  CUSTOM_METADATA_KEY,
  colorAxisStorageKey,
  countersStorageKey,
  labelsStorageKey,
  sizeAxisStorageKey,
} from '../common/configurations/commonConfigurations';
import { defaultCountersConfigurations } from '../common/configurations/countersConfigurations';
import { defaultCalculations } from '../common/configurations/defaultConfigurations';
import {
  DataNode,
  NodeType,
  OneAiAnalyticsProps,
} from '../common/types/componentsInputs';
import {
  CalculationConfiguration,
  CounterConfiguration,
  CounterType,
  CountersConfigurations,
  CountersLocalStorageObject,
  MetadataKeyValue,
} from '../common/types/customizeBarTypes';
import {
  Cluster,
  Item,
  MetaData,
  Properties,
  Trend,
} from '../common/types/modals';
import {
  COLLECTION_TYPE,
  getNodeId,
  getNodeItemsCount,
  getNodeOriginalAndTranslatedText,
  getNodeText,
  getNodeTrends,
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
  dataNodes = { totalItems: 0, nodes: [] },
  currentNode,
  currentPage = 0,
  totalPagesAmount = 0,
  goBackClicked = () => {},
  nodeClicked = () => {},
  nextPageClicked = () => {},
  prevPageClicked = () => {},
  itemsDisplay = ItemsListDisplay,
  darkMode = true,
  background,
  treemapBigColor = darkMode ? '#322F46' : '#F7F7F7',
  treemapSmallColor = darkMode ? '#2C293D' : '#F7F7F7',
  treemapCountFontSize = 14,
  fontFamily = "'Poppins', sans-serif",
  textColor = darkMode ? 'white' : '#111111',
  treemapBorderWidth = 1,
  navbarColor,
  treemapBorderColor = darkMode ? '#272535' : 'white',
  barColor = darkMode ? '#322F46' : '#F7F7F7',
  loading,
  error = null,
  nodesPath = [],
  dateRangeChanged = () => {},
  labelsFilters,
  labelClicked = () => {},
  labelFilterDeleted = () => {},
  trendPeriods,
  trendPeriodsChanged,
  splitPhrase,
  mergeClusters,
  searchSimilarClusters,
  translationEnabled = true,
  customizeEnabled = true,
  filterOnlySkills = false,
  datePickerEnabled = true,
  startDate = null,
  endDate = null,
  toggleHide = () => {},
  propertiesFilters = {},
  setPropertiesFilters = () => {},
  metaOptions,
  currentMetaOption,
  metaOptionsChanged = () => {},
  refresh = () => {},
  uniqueMetaKey: uniquePropertyName,
  headerEnabled = true,
  breadCrumbsEnabled = true,
  itemPercentageEnabled = true,
  mergeMenuEnabled = true,
  headerFiltersEnabled = true,
  signalsEnabled = true,
  navigationDropDownEnabled = true,
  tooltipOffsetLeft = 0,
  tooltipOffsetTop = 0,
}) => {
  const [display, setDisplay] = useState('Treemap' as Displays);
  const { width, height, ref } = useResizeDetector();
  const [metaData, setMetaData] = useState({} as MetaData);
  const [nodes, setNodes] = useState([] as DataNode[]);
  const [labels, setLabels] = useState([] as string[]);
  const [counters, setCounters] = useState([] as CounterType[]);
  const [sizeAxis, setSizeAxis] = useState(null as MetadataKeyValue | null);
  const [colorAxis, setColorAxis] = useState([] as CounterType[]);
  const [countersConfigurations, setCountersConfigurations] = useState(
    {} as CountersConfigurations
  );
  const [currentNodeActions, setCurrentNodeActions] = useState(
    null as { type: NodeType; id: string; text: string } | null
  );
  const [translate, setTranslate] = useState(false);

  const [fromDate, setFromDate] = useState(
    startDate ? (new Date(startDate) as Date) : null
  );
  const [toDate, setToDate] = useState(
    endDate ? (new Date(endDate) as Date) : null
  );
  const loadedNodes = useRef([] as { type: string; id: string }[]);
  const currentCollection = useRef(null as string | null);
  const [currentHoveredNode, setCurrentHoveredNode] = useState(
    null as {
      type: NodeType;
      id: string;
      text: string;
      properties: Properties;
    } | null
  );

  useEffect(() => {
    if (
      !nodesPath ||
      nodesPath.length === 0 ||
      currentCollection.current === nodesPath[0].text
    )
      return;

    currentCollection.current = nodesPath[0].text;
    setLabels(
      JSON.parse(
        localStorage.getItem(
          getCurrentStorageKey(labelsStorageKey, currentCollection.current)
        ) ?? '[]'
      )
    );

    setCounters(
      getInitialCounterTypes(
        defaultCalculations,
        [
          {
            metadataKeyValue: { key: CUSTOM_METADATA_KEY },
            calculationName: percentOfTotalUniqueItemsCalculationName,
          },
          {
            metadataKeyValue: { key: CUSTOM_METADATA_KEY },
            calculationName: totalUniqueItemsCalculationName,
          },
          {
            metadataKeyValue: { key: 'signals' },
            calculationName: topGroupPercentCalculationName,
          },
        ],
        currentCollection.current,
        countersStorageKey
      ) as CounterType[]
    );

    const storedSizeAxis = localStorage.getItem(
      getCurrentStorageKey(sizeAxisStorageKey, currentCollection.current)
    );
    setSizeAxis(
      storedSizeAxis ? JSON.parse(storedSizeAxis) : { key: CUSTOM_METADATA_KEY }
    );

    setColorAxis(
      getInitialCounterTypes(
        defaultCalculations,
        [
          {
            metadataKeyValue: { key: 'signals', value: 'positive' },
            calculationName: percentOfItemsCalculationName,
          },
          {
            metadataKeyValue: { key: 'signals', value: 'negative' },
            calculationName: percentOfItemsCalculationName,
          },
        ],
        currentCollection.current,
        colorAxisStorageKey
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
      dataNodes.nodes.map((d) => {
        const itemsCount = getNodeItemsCount(d);
        const nodeText = getNodeText(d);
        const { originalText, translatedText } =
          getNodeOriginalAndTranslatedText(d);
        return {
          id: getNodeId(d),
          amount: itemsCount,
          text: nodeText,
          item_original_text: originalText ?? nodeText,
          item_translated_text: translatedText,
          metadata: {
            [CUSTOM_METADATA_KEY]: [
              { value: CUSTOM_METADATA_KEY, count: itemsCount },
            ],
            ...d.data.metadata,
          },
          trends: getNodeTrends(d),
          type: d.type,
          properties: d.data.properties,
          metadata_stats: (d.data as Cluster).metadata_stats,
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
        newCountersConfigurations[key] = counterConfiguration;
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

    const storedColorAxis = colorAxis.map((counter) => {
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
      localStorage.setItem(
        getCurrentStorageKey(colorAxisStorageKey, currentCollection.current),
        JSON.stringify(storedColorAxis)
      );
      localStorage.setItem(
        getCurrentStorageKey(sizeAxisStorageKey, currentCollection.current),
        JSON.stringify(sizeAxis)
      );
    }
  }, [counters, labels, sizeAxis, colorAxis]);

  useEffect(() => {
    dateRangeChanged(fromDate, toDate);
  }, [fromDate, toDate]);

  useEffect(() => {
    ReactTooltip.hide();
    ReactTooltip.rebuild();
  });

  return (
    <div
      className={`oneai-analytics-namespace h-full w-full  overflow-hidden ${
        darkMode ? 'dark' : ''
      }`}
    >
      <div
        id="headlessui-portal-root"
        className={`h-full w-full flex flex-col relative overflow-hidden bg-[#f3e5e5] dark:bg-[#161414] p-1 ${
          darkMode ? 'dark' : ''
        }`}
        style={{ background }}
      >
        <ReactTooltip
          id="global"
          overridePosition={({ left, top }) => {
            return {
              left: left - tooltipOffsetLeft,
              top: top - tooltipOffsetTop,
            };
          }}
        />
        <ReactTooltip
          id="global-actions"
          place="top"
          effect="solid"
          overridePosition={({ left, top }) => {
            return {
              left: left - tooltipOffsetLeft,
              top: top - tooltipOffsetTop,
            };
          }}
          clickable={true}
          className="!p-1 !fixed"
        >
          <div className="flex flex-col w-full h-full items-baseline">
            <button
              type="button"
              onClick={() => {
                ReactTooltip.hide();
                setCurrentNodeActions(currentHoveredNode);
              }}
              className="text-gray-900 w-full bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-2 mr-1 mb-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              {currentHoveredNode?.type === 'Cluster' ? 'Merge' : 'Split'}
            </button>
            <button
              type="button"
              onClick={() => {
                ReactTooltip.hide();
                ReactTooltip.rebuild();
                toggleHide(
                  currentHoveredNode,
                  currentHoveredNode?.properties?.['hide'] === 'true'
                    ? 'false'
                    : 'true'
                );
              }}
              className="text-gray-900 w-full bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-2 mr-1 mb-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              {currentHoveredNode?.properties?.['hide'] === 'true'
                ? 'Show'
                : 'Hide'}
            </button>
          </div>
        </ReactTooltip>
        <ItemActions
          node={currentNodeActions}
          splitPhrase={splitPhrase}
          mergeClusters={mergeClusters}
          searchSimilarClusters={searchSimilarClusters}
          translationEnabled={translate}
        />
        {headerEnabled ? (
          <div
            className="w-full rounded-t-md border-b border-[#322F46] bg-white dark:bg-[#272535]"
            style={{
              height: '65px',
              background: navbarColor,
              fontFamily: fontFamily,
            }}
          >
            <div className="flex flex-row items-center py-6 ml-[24px] h-full">
              <div className="flex flex-row w-5/12 justify-start items-center">
                <div className="h-full flex">
                  <svg
                    className={getVisualizationLogoClasses(
                      display === 'Treemap'
                    )}
                    onClick={() => setDisplay('Treemap')}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.5 5.89477C3.5 5.06635 4.17157 4.39478 5 4.39478H19C19.8284 4.39478 20.5 5.06635 20.5 5.89478V11.9211H3.5V5.89477Z" />
                    <path d="M3.5 11.9736H13.8684V19.4999H5C4.17157 19.4999 3.5 18.8284 3.5 17.9999V11.9736Z" />
                    <path d="M13.9211 11.9736H20.5001V17.9999C20.5001 18.8284 19.8285 19.4999 19.0001 19.4999H13.9211V11.9736Z" />
                    <path d="M8.68433 4.36841V11.4737" />
                  </svg>

                  <svg
                    className={getVisualizationLogoClasses(
                      display === 'BarChart'
                    )}
                    onClick={() => setDisplay('BarChart')}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.75 20.25V3.75" />
                    <path d="M3.75 9.75H15.75C15.75 11.5074 15.75 12.4926 15.75 14.25H3.75" />
                    <path d="M20.25 5.25H3.75V9.75H20.25V5.25Z" />
                    <path d="M12.75 14.25V18.75H3.75" />
                  </svg>
                </div>
                {datePickerEnabled ? (
                  <div>
                    <DatesFilters
                      fromDate={fromDate}
                      fromDateChanged={setFromDate}
                      toDate={toDate}
                      toDateChanged={setToDate}
                      trendPeriods={trendPeriods}
                      trendPeriodsChanged={trendPeriodsChanged}
                    />
                  </div>
                ) : null}

                {headerFiltersEnabled ? (
                  <div>
                    <LabelsFiltersSelect
                      filterOnlySkills={filterOnlySkills}
                      selectedLabels={labelsFilters ?? []}
                      countersConfigurations={countersConfigurations}
                      labelFilterDeleted={labelFilterDeleted}
                      selectedMetadataKeyValueChange={(metadataKeyValue) =>
                        labelClicked(
                          metadataKeyValue.key,
                          metadataKeyValue.value!
                        )
                      }
                    />
                  </div>
                ) : null}
                {customizeEnabled ? (
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
                      selectedSizeAxis={sizeAxis}
                      sizeAxisChanged={setSizeAxis}
                      currentColorsAxis={colorAxis}
                      colorsAxisChanged={setColorAxis}
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-row w-full justify-end items-center">
                <ArrowPathIcon
                  onClick={refresh}
                  data-for="global"
                  data-tip="Refresh data"
                  className="h-6 w-6 p-1 mr-1 hover:cursor-pointer focus:outline-none text-[#747189] dark:hover:text-white"
                />
                {propertiesFilters['hide'] === 'true' ? (
                  <EyeIcon
                    onClick={() => setPropertiesFilters({ hide: 'false' })}
                    data-for="global"
                    data-tip="Show hidden nodes"
                    className="h-6 w-6 p-1 mr-1 hover:cursor-pointer focus:outline-none text-[#747189] dark:hover:text-white"
                  />
                ) : (
                  <EyeSlashIcon
                    onClick={() => setPropertiesFilters({ hide: 'true' })}
                    data-for="global"
                    data-tip="Hide hidden nodes"
                    className="h-6 w-6 p-1 mr-1 hover:cursor-pointer focus:outline-none bg-[#EFEFEF] dark:text-white dark:bg-[#322F46]"
                  />
                )}
                {translationEnabled ? (
                  <LanguageIcon
                    onClick={() => setTranslate((translate) => !translate)}
                    data-for="global"
                    data-tip={
                      translate ? 'Disable translation' : 'Enable translation'
                    }
                    className={`h-6 w-6 p-1 mr-1 hover:cursor-pointer focus:outline-none ${
                      translate
                        ? 'bg-[#EFEFEF] dark:text-white dark:bg-[#322F46]'
                        : 'text-[#747189] hover:cursor-pointer dark:hover:text-white'
                    }`}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div
          className="w-full grow flex flex-col overflow-hidden bg-white relative dark:bg-[#272535]"
          style={{ background: navbarColor }}
        >
          {breadCrumbsEnabled ? (
            <div
              className="w-full"
              style={{
                height: '65px',
                fontFamily: fontFamily,
              }}
            >
              <div className={'flex flex-row items-center ml-[24px] h-full'}>
                <div
                  className="flex flex-row justify-start mr-4 items-center w-full"
                  style={{
                    fontFamily: fontFamily,
                    fontWeight: 300,
                    fontStyle: 'normal',
                    fontSize: '14px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => goBackClicked(1)}
                    disabled={currentNode === null}
                    className={`rounded-lg inline-flex ${
                      currentNode
                        ? 'hover:bg-[#EFEFEF] dark:hover:bg-slate-700'
                        : 'hover:cursor-default'
                    }`}
                  >
                    {currentNode ? (
                      <svg
                        className="h-[1em] w-[1em] self-center text-[#111111] dark:text-white"
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
                    ) : (
                      <HomeIcon className="h-[0.9em] w-[1em] text-[#111111] dark:text-white" />
                    )}

                    <span className="sr-only">Go back</span>
                  </button>

                  <div className="ml-1 text-[#111111] dark:text-gray-300 truncate flex items-center">
                    {nodesPath.map((node, i) => (
                      <div key={i} className="flex">
                        <div className="max-w-[50ch] truncate">
                          <span
                            className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-50"
                            onClick={() =>
                              goBackClicked(
                                i === 0
                                  ? nodesPath.length
                                  : nodesPath.length - 1 - i
                              )
                            }
                            dir="auto"
                          >
                            {translate && node.translated
                              ? node.translated
                              : node.text}
                          </span>
                        </div>
                        {nodesPath.length - 1 !== i && (
                          <span className="ml-1 mr-1">/</span>
                        )}
                      </div>
                    ))}
                    {metaOptions && nodesPath.length === 1 ? (
                      <span className="ml-1 flex text-[#111111] dark:text-gray-300">
                        <span className="mr-1">/ </span>
                        <SingleSelect
                          navigationDropDownEnabled={navigationDropDownEnabled}
                          options={metaOptions}
                          selectedLabel={currentMetaOption ?? 'text'}
                          onSelect={metaOptionsChanged}
                        />
                      </span>
                    ) : null}
                    {(labelsFilters?.length ?? 0) > 0 &&
                      labelsFilters
                        ?.filter((label) => label.value)
                        .map((keyValue, i) => (
                          <span key={i} className="flex items-center">
                            <span className="text-gray-500 ml-1">/ </span>
                            <LabelDisplay
                              metadataKey={keyValue.key}
                              value={keyValue.value ?? ''}
                              countersConfiguration={countersConfigurations}
                              labelClicked={() => {}}
                              maxWidth="20ch"
                              color="#747189"
                            />
                            <button
                              type="button"
                              onClick={() => labelFilterDeleted(i)}
                            >
                              <XMarkIcon className="h-4 w-4 text-gray-400 hover:scale-125 transition duration-100 ease-linear" />
                              <span className="sr-only">
                                Delete label filter
                              </span>
                            </button>
                          </span>
                        ))}
                    {totalPagesAmount > 1 && currentPage > 0 && (
                      <span className="ml-1 text-gray-500">
                        / {currentPage + 1}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  {!loading && (
                    <CountersLabelsDisplay
                      counters={counters}
                      labels={labels}
                      metadata={nodes.reduce(
                        (finalMetadata, currentNode) =>
                          mergeMetadata(
                            finalMetadata,
                            currentNode.metadata,
                            dataNodes.totalItems
                          ),
                        {}
                      )}
                      trends={nodes.reduce(
                        (finalMetadata, currentNode) =>
                          mergeTrends(finalMetadata, currentNode.trends),
                        [] as Trend[]
                      )}
                      countersConfiguration={countersConfigurations}
                      labelClicked={labelClicked}
                      totalItems={dataNodes.totalItems}
                      totalUniqueItemsStats={dataNodes.uniqueItemsStats}
                      uniqueItemsStats={dataNodes.uniqueItemsStats}
                      uniquePropertyName={uniquePropertyName}
                      signalsEnabled={signalsEnabled}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => goBackClicked(1)}
              disabled={currentNode === null}
              className={`rounded-lg absolute z-[50000] left-2 top-2 inline-flex ${
                currentNode
                  ? 'hover:bg-[#EFEFEF] dark:hover:bg-slate-700'
                  : 'hover:cursor-default'
              }`}
            >
              {currentNode ? (
                <svg
                  className="h-[1em] w-[1em] self-center text-[#111111] dark:text-white"
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
              ) : null}

              <span className="sr-only">Go back</span>
            </button>
          )}
          <div className="w-full h-full flex flex-col overflow-x-hidden">
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
                  className="h-full flex items-center justify-center hover:cursor-pointer dark:bg-[#322F46]"
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
                className="h-full w-full overflow-y-auto no-scrollbar overflow-x-hidden"
              >
                {error !== null || dataNodes.totalItems === 0 ? (
                  <p className="h-full w-full ml-[24px] dark:text-white">
                    {error}
                    {dataNodes.totalItems === 0 ? (
                      (labelsFilters?.length ?? 0) > 0 ? (
                        <span className="flex flex-col">
                          <span>No items match your filter:</span>
                          {labelsFilters?.map((labelFilter) => (
                            <span>
                              {labelFilter.key}
                              {labelFilter.value ? `=${labelFilter.value}` : ''}
                            </span>
                          ))}
                        </span>
                      ) : (
                        ' Collection is empty'
                      )
                    ) : null}
                  </p>
                ) : currentNode && currentNode.type === 'Phrase' ? (
                  itemsDisplay({
                    items: dataNodes.nodes.map(
                      (dataNode) => dataNode.data as Item
                    ),
                    bgColor: navbarColor,
                    textColor: textColor,
                    counters: counters,
                    labels: labels,
                    labelClicked: labelClicked,
                    countersConfiguration: countersConfigurations,
                    translate: translate,
                    totalItems: dataNodes.totalItems,
                  })
                ) : display === 'Treemap' ? (
                  <Treemap
                    dataNodes={nodes}
                    height={height ?? 0}
                    width={width ?? 0}
                    nodeClicked={(node) => {
                      ReactTooltip.hide();
                      nodeClicked({
                        type: !currentNode
                          ? 'Cluster'
                          : currentNode.type === 'Cluster'
                          ? 'Phrase'
                          : 'Item',
                        id: node.id,
                      });
                    }}
                    labels={labels}
                    counters={counters}
                    bigColor={treemapBigColor}
                    smallColor={treemapSmallColor}
                    countFontSize={treemapCountFontSize}
                    fontFamily={fontFamily}
                    textColor={textColor}
                    borderWidth={treemapBorderWidth}
                    borderColor={treemapBorderColor}
                    countersConfiguration={countersConfigurations}
                    labelClicked={labelClicked}
                    sizeAxis={sizeAxis}
                    colorAxis={colorAxis}
                    nodeActionsClicked={(node) => {
                      setCurrentHoveredNode({
                        type: !currentNode
                          ? 'Cluster'
                          : currentNode.type === 'Cluster'
                          ? 'Phrase'
                          : 'Item',
                        id: node.id,
                        text: node.text ?? '',
                        properties: node.properties,
                      });
                    }}
                    translate={translate}
                    totalItems={dataNodes.totalItems}
                    totalUniqueItemsStats={dataNodes.uniqueItemsStats}
                    uniquePropertyName={uniquePropertyName}
                    itemPercentageEnabled={itemPercentageEnabled}
                    mergeMenuEnabled={mergeMenuEnabled}
                    signalsEnabled={signalsEnabled}
                  />
                ) : (
                  <BarChart
                    dataNodes={nodes}
                    height={height ?? 0}
                    width={width ?? 0}
                    nodeClicked={(node) => {
                      ReactTooltip.hide();
                      nodeClicked({
                        type: !currentNode
                          ? 'Cluster'
                          : currentNode.type === 'Cluster'
                          ? 'Phrase'
                          : 'Item',
                        id: node.id,
                      });
                    }}
                    fontFamily={fontFamily}
                    textColor={textColor}
                    barColor={barColor}
                    labels={labels}
                    counters={counters}
                    countersConfiguration={countersConfigurations}
                    labelClicked={labelClicked}
                    sizeAxis={sizeAxis}
                    colorAxis={colorAxis}
                    nodeActionsClicked={(node) => {
                      setCurrentHoveredNode({
                        type: !currentNode
                          ? 'Cluster'
                          : currentNode.type === 'Cluster'
                          ? 'Phrase'
                          : 'Item',
                        id: node.id,
                        text: node.text ?? '',
                        properties: node.properties,
                      });
                    }}
                    translate={translate}
                    totalItems={dataNodes.totalItems}
                    totalUniqueItemsStats={dataNodes.uniqueItemsStats}
                    uniquePropertyName={uniquePropertyName}
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
    </div>
  );
};

function getVisualizationLogoClasses(active: boolean) {
  return `h-7 w-7 mr-1 p-1 rounded-md ${
    active
      ? 'bg-[#EFEFEF] dark:text-white dark:bg-[#322F46]'
      : 'text-[#747189] hover:cursor-pointer dark:hover:text-white'
  }`;
}

function mergeMetadata(
  metadata1: MetaData,
  metadata2: MetaData,
  totalItems?: number
): MetaData {
  const newMetadata: MetaData = {};
  Array.from(
    new Set([...Object.keys(metadata1), ...Object.keys(metadata2)])
  ).forEach((key) => {
    if (totalItems === undefined || key !== CUSTOM_METADATA_KEY)
      newMetadata[key] = [...(metadata1[key] ?? []), ...(metadata2[key] ?? [])];
  });

  if (totalItems === undefined) return newMetadata;
  newMetadata[CUSTOM_METADATA_KEY] = [
    { value: CUSTOM_METADATA_KEY, count: totalItems },
  ];

  return newMetadata;
}

function mergeTrends(trends1?: Trend[], trends2?: Trend[]): Trend[] {
  if (!trends1 || !trends2) return [];
  const newTrends: Trend[] = [];
  const sourceTrends = trends1.length >= trends2.length ? trends1 : trends2;
  sourceTrends.forEach((_, i) => {
    newTrends.push({
      days: sourceTrends[i].days,
      period_start_date: sourceTrends[i].period_start_date,
      period_end_date: sourceTrends[i].period_end_date,
      items_count:
        (trends1.at(i)?.items_count ?? 0) + (trends2.at(i)?.items_count ?? 0),
      phrases_count:
        (trends1.at(i)?.phrases_count ?? 0) +
        (trends2.at(i)?.phrases_count ?? 0),
      metadata: mergeMetadata(
        trends1.at(i)?.metadata ?? {},
        trends2.at(i)?.metadata ?? {}
      ),
    });
  });

  return newTrends;
}

function getInitialCounterTypes(
  calculationConfiguration: CalculationConfiguration[],
  defaultCounters: CountersLocalStorageObject[],
  collection: string,
  storageKey: string
): CounterType[] {
  const storedCounters: CountersLocalStorageObject[] = JSON.parse(
    localStorage.getItem(getCurrentStorageKey(storageKey, collection)) ?? '[]'
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
