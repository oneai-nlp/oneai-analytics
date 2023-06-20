import Papa from 'papaparse';
import React, { DragEvent, FC, useEffect, useRef, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import {
  COLUMN_TYPES_OPTIONS,
  CUSTOM_VALUE_ID,
  IGNORE_ID,
} from '../common/components/UploadCSVComponents/constants';
import SingleSelect from '../common/components/UploadCSVComponents/SingleSelect';
import { UploadParams } from '../common/types/componentsInputs';
import { resolveDomain } from '../common/utils/externalInputs';
import { OneAiLoader } from '../common/components/OneAiLoader';

const allowedExtensions = ['csv'];

const OneAiUpload: FC<UploadParams> = ({
  domain = 'prod',
  apiKey = '',
  collection = '',
  darkMode = true,
  steps = '',
  input_skill,
  resetAfterUpload = true,
  expected_languages = '',
  override_language_detection = false,
  createCollection = false,
  collectionDomain = 'survey',
  isPublic = false,
  goToCollection,
}: UploadParams) => {
  domain = resolveDomain(domain);
  const [data, setData] = useState([] as string[][]);
  const [error, setError] = useState(null as string | null);
  const [file, setFile] = useState(null as File | null);
  const [columnsConfigurations, setColumnsConfigurations] = useState(
    [] as { id: string; customText?: string }[]
  );
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [csvHasHeaders, setCsvHasHeaders] = useState(true);
  const [numberOfRowsToSkip, setNumberOfRowsToSkip] = useState(0);
  const [numberOfRowsToDisplay, setNumberOfRowsToDisplay] = useState(100);
  const [maxRows, setMaxRows] = useState(null as number | null);
  const [taskId, setTaskId] = useState(null as string | null);
  const [uploadStatus, setUploadStatus] = useState(null as string | null);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [collectionItemsAmount, setCollectionItemsAmount] = useState(
    null as number | null
  );
  const currentParser = useRef(null as Papa.Parser | null);
  const initiated = useRef(false);

  useEffect(() => {
    if (!taskId || !uploaded) return;
    const interval = setInterval(async () => {
      const res = await fetch(
        encodeURI(`${domain}/api/v0/pipeline/async/tasks/${taskId}`),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey ?? '',
          },
        }
      );
      const data = await res.json();
      if (data.status === 'COMPLETED') {
        setUploaded(true);
        setUploadStatus('completed');
        if (resetAfterUpload) {
          handleReset();
        }
        clearInterval(interval);
      } else if (data.status === 'FAILED') {
        setUploadStatus('failed');
        clearInterval(interval);
      } else {
        setUploadStatus('in progress');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [taskId, uploaded]);

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;
    const fetchData = async (abortController: AbortController) => {
      const res = await fetch(
        encodeURI(
          `${domain}/clustering/v1/collections/${collection}/clusters?limit=1`
        ),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey ?? '',
          },
          signal: abortController.signal,
        }
      );

      const data = await res.json();
      setCollectionItemsAmount(() => {
        setLoading(false);
        return data.total_items;
      });
    };
    const controller = new AbortController();
    if (domain.length === 0 || apiKey.length === 0 || collection.length === 0)
      return;

    fetchData(controller);

    return () => controller.abort();
  }, [domain, apiKey, collection]);

  const handleFileChange = (e: { target: { files: FileList | null } }) => {
    setError(null);
    setUploaded(false);
    try {
      currentParser.current?.abort();
    } catch (e) {
      console.error(e);
    }

    const inputFile = e.target.files?.item(0);
    if (!inputFile) return;
    // Check if user has entered the file
    // Check the file extensions, if it not
    // included in the allowed extensions
    // we show the error
    const fileExtension = inputFile.type.split('/')[1];
    if (!allowedExtensions.includes(fileExtension)) {
      setError('Please input a csv file');
      return;
    }

    // If input type is correct set the state
    setFile(inputFile);
    handleParse(inputFile);
  };

  const handleParse = (file: File) => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError('Enter a valid file');

    let finished = false;

    Papa.parse(file, {
      worker: true, // Don't bog down the main thread if its a big file
      encoding: 'utf-8',
      chunkSize: 512,
      step: function ({ data, errors }, parser) {
        if (errors.length > 0) {
          console.log('errors', errors[0]);
        }

        currentParser.current = parser;
        if (!finished) {
          setData((prev) => {
            if (prev.length === 0) {
              setColumnsConfigurations(
                (data as string[]).map(() => ({ id: IGNORE_ID }))
              );
            }

            if (prev.length > 200) {
              finished = true;
            }

            return [...prev, data as string[]];
          });
        }

        setTotalNumberOfRows((prev) => prev + 1);
      },
      complete: function (results, file) {
        console.log('parsing complete read', results, file);
      },
    });
  };

  const handleReset = () => {
    setData([]);
    setFile(null);
    setColumnsConfigurations([]);
    setCsvHasHeaders(true);
    setNumberOfRowsToSkip(0);
    setMaxRows(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    if (createCollection) {
      try {
        const res = await fetch(
          encodeURI(`${domain}/clustering/v1/collections/${collection}/create`),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': apiKey ?? '',
            },
            body: JSON.stringify({
              access: {
                ...(isPublic && {
                  all: {
                    query: true,
                    list_clusters: true,
                    list_items: true,
                    add_items: false,
                    edit_clusters: false,
                    discoverable: true,
                  },
                }),
              },
              domain: collectionDomain,
            }),
          }
        );

        if (!res.ok) {
          const error = await res.json();
          console.error('error', error);
          setLoading(false);
          setError("Couldn't create collection");
          return;
        }
      } catch (e) {
        console.error(e);
        setLoading(false);
        setError("Couldn't create collection");
        return;
      }
    }

    const appendSteps: string[] =
      steps.length > 0
        ? steps
            .replaceAll('[', '')
            .replaceAll(']', '')
            .replaceAll(' ', '')
            .split(',')
        : [];

    const expectedLanguages =
      expected_languages.length > 0
        ? expected_languages
            .replaceAll('[', '')
            .replaceAll(']', '')
            .replaceAll(' ', '')
            .split(',')
        : [];

    try {
      const pipelineJson = {
        content_type: 'text/csv',
        multilingual: {
          enabled: true,
          ...(expectedLanguages.length > 0 && {
            expected_languages: expectedLanguages,
          }),
          ...(override_language_detection && { override_language_detection }),
        },
        steps: [
          ...(appendSteps.length > 0
            ? appendSteps.map((step) => ({ skill: step }))
            : []),
          {
            skill: 'clustering',
            params: {
              collection,
              ...(input_skill && { input_skill }),
            },
          },
        ],
        csv_params: {
          columns: columnsConfigurations.map((cc) =>
            cc.id === IGNORE_ID
              ? false
              : cc.id === CUSTOM_VALUE_ID
              ? cc.customText
              : cc.id
          ),
          skip_rows: (csvHasHeaders ? 1 : 0) + numberOfRowsToSkip,
          max_rows: maxRows !== null ? maxRows : totalNumberOfRows,
        },
      };

      const fetchFormData = new FormData();
      fetchFormData.append('file', file);

      const uploadRes = await fetch(
        encodeURI(
          `${domain}/api/v0/pipeline/async/file?pipeline=${JSON.stringify(
            pipelineJson
          )}`
        ),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/csv',
            'api-key': apiKey ?? '',
            'Content-Disposition': `attachment; filename=${encodeURI(
              file.name
            )}`,
          },
          body: file,
        }
      );

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        console.error('error', error);
        setLoading(false);
        setError("Couldn't upload file");
        return;
      }

      const statusData = await uploadRes.json();
      console.log('file uploaded', statusData);
      setUploadStatus(statusData['status']);
      setTaskId(statusData['task_id']);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError("Couldn't upload file");
      return;
    }

    setError(null);

    if (resetAfterUpload) {
      handleReset();
    }

    setUploaded(true);
    setLoading(false);
  };

  useEffect(() => {
    ReactTooltip.hide();
    ReactTooltip.rebuild();
  });

  const uploadDisabled =
    columnsConfigurations.filter((c) => c.id === 'input').length !== 1;

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDragAndDrop = (event: DragEvent) => {
    if (uploaded || file) {
      return;
    }

    const target = event.dataTransfer;
    event.preventDefault();

    if (target && target.files.length > 0) {
      handleFileChange({
        target: {
          files: target.files,
        },
      });
    }
  };

  return (
    <div
      onDrop={handleDragAndDrop}
      onDragOver={handleDragOver}
      className={`oneai-analytics-namespace h-full w-full p-2 ${
        darkMode ? 'dark' : ''
      }`}
    >
      <div
        className={`h-full w-full overflow-hidden bg-[#272535] flex flex-col items-center text-white ${
          darkMode ? 'dark' : ''
        }`}
      >
        <ReactTooltip id="global" />
        {error ? (
          <div className="w-full p-2 relative h-2/6">
            <div className="absolute top-0 right-0 p-2">
              <svg
                onClick={() => setError(null)}
                className="w-6 h-6 text-white cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <svg
                className="w-20 h-20 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <div className="text-2xl font-bold mt-2">{error}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {uploaded ? (
          <div className="w-full p-2 h-full">
            <div className="w-full h-full flex flex-col items-center justify-center">
              {uploadStatus === 'completed' ? (
                <svg
                  className="w-20 h-20 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : null}

              {uploadStatus === 'completed' ? (
                <h1 className="text-2xl font-bold mt-4">Upload Complete</h1>
              ) : (
                <div className="grid grid-flow-row-dense justify-center items-center">
                  <OneAiLoader />
                  <p className="font-medium text-center text-lg">
                    Processing...
                  </p>
                </div>
              )}

              {uploadStatus === 'completed' ? (
                <>
                  <p className="text-lg mt-2">
                    {data.length > 0
                      ? (maxRows ?? totalNumberOfRows) + ' items'
                      : 'Data'}{' '}
                    has been uploaded to '{collection}'
                  </p>
                </>
              ) : null}
              <div className="flex flex-col w-full justify-center items-center">
                <button
                  className="bg-[#4D4DFE] text-white text-lg font-normal py-2 px-4 rounded-md mt-4"
                  onClick={() => {
                    setUploaded(false);
                    setUploadStatus(null);
                    setTaskId(null);
                  }}
                >
                  Upload another file
                </button>
                {goToCollection &&
                uploadStatus !== 'in progress' &&
                uploadStatus !== null ? (
                  <button
                    className="bg-[#4D4DFE] text-white text-lg font-normal py-2 px-4 rounded-md mt-4"
                    onClick={() => goToCollection()}
                  >
                    Go back to collection
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : data.length > 0 ? (
          <div
            className={`w-full p-2 ${uploaded || error ? 'h-4/6' : 'h-full'}`}
          >
            {loading ? (
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                    ></path>
                  </svg>
                  <span className="text-white">Loading...</span>
                </div>
              </div>
            ) : null}
            <div
              className={
                'h-full w-full flex flex-col relative ' +
                (loading ? 'pointer-events-none' : '')
              }
            >
              <div className="h-auto w-full flex justify-between">
                <span className="text-gray-200 pl-2">
                  Select columns for upload to{' '}
                  <span className="text-white">' {collection} '</span>
                </span>
                <div className="flex items-center">
                  <span className="text-gray-200 pr-2">Preview rows</span>
                  <input
                    className="w-16 h-8 text-center text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    type="number"
                    value={numberOfRowsToDisplay}
                    onChange={(e) =>
                      setNumberOfRowsToDisplay(Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="relative overflow-auto max-h-full block shadow-md sm:rounded-lg grow w-full scrollbar-upload">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 sticky top-0 bg-[#2B293B]">
                    <tr>
                      {data[0].map((header, i) => (
                        <th
                          key={`${header} - ${i}`}
                          scope="col"
                          className="px-2 py-3 w-max"
                        >
                          <div className="w-full flex flex-col items-start">
                            <div className="w-max">
                              <SingleSelect
                                options={COLUMN_TYPES_OPTIONS}
                                selectedLabelId={
                                  columnsConfigurations[i].id ?? null
                                }
                                onSelect={(selectedLabelId) => {
                                  setColumnsConfigurations((prev) => {
                                    const newColumnsConfigurations = [...prev];
                                    newColumnsConfigurations[i] = {
                                      id: selectedLabelId,
                                      ...(selectedLabelId ===
                                        CUSTOM_VALUE_ID && {
                                        customText: csvHasHeaders
                                          ? header
                                          : `Column ${i + 1}`,
                                      }),
                                    };
                                    return newColumnsConfigurations;
                                  });
                                }}
                              />
                              <div className="w-max h-6">
                                {columnsConfigurations[i].id ===
                                CUSTOM_VALUE_ID ? (
                                  <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder={
                                      columnsConfigurations[i].customText
                                    }
                                    onChange={(e) =>
                                      (columnsConfigurations[i].customText =
                                        e.target.value.length > 0
                                          ? e.target.value
                                          : csvHasHeaders
                                          ? header
                                          : `Column ${i + 1}`)
                                    }
                                  />
                                ) : null}
                              </div>
                            </div>
                            <span className="w-max pl-1">
                              {csvHasHeaders && header
                                ? header
                                : `Column ${i + 1}`}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="h-96 overflow-y-auto">
                    {data
                      .slice(csvHasHeaders ? 1 : 0, numberOfRowsToDisplay)
                      .map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          {row.map((cell, i) => (
                            <td
                              key={i}
                              className="px-2 py-3 max-w-[200px] truncate"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="absolute bottom-4 w-full">
                <div className="flex justify-between mb-2 p-4 backdrop-blur-[2px]">
                  <div className="flex">
                    <div className="flex items-center mr-4">
                      <label
                        htmlFor="checkbox"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        CSV has headers
                      </label>
                      <input
                        checked={csvHasHeaders}
                        onChange={(e) => setCsvHasHeaders(e.target.checked)}
                        id="checkbox"
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="flex items-center">
                      <label
                        htmlFor="checkbox"
                        data-for="global"
                        data-tip="Limit number of rows to upload"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Upload rows
                      </label>
                      <input
                        value={maxRows ?? totalNumberOfRows}
                        onChange={(e) =>
                          setMaxRows(
                            Number(e.target.value || totalNumberOfRows)
                          )
                        }
                        type="number"
                        className="w-16 h-8 text-center text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center">
                      <label
                        htmlFor="checkbox"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Skip rows
                      </label>
                      <input
                        value={numberOfRowsToSkip}
                        onChange={(e) =>
                          setNumberOfRowsToSkip(Number(e.target.value))
                        }
                        type="number"
                        className="w-16 h-8 text-center text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-gray-400 font-medium px-5 text-center hover:text-gray-300 mr-12"
                    >
                      Cancel
                    </button>
                    <span
                      data-for="global"
                      data-tip={
                        uploadDisabled
                          ? 'You must select one column for text'
                          : 'Upload items'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => handleUpload()}
                        disabled={uploadDisabled}
                        className={`font-medium rounded-sm text-sm px-5 py-2.5 text-center ${
                          uploadDisabled
                            ? 'bg-gray-500 text-gray-200'
                            : 'text-white bg-indigo-500 hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800'
                        }`}
                      >
                        Upload {maxRows ?? totalNumberOfRows} items
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <span className={`${uploaded ? 'mt-4' : 'mt-36'}`}>
              {collectionItemsAmount && collectionItemsAmount > 0
                ? `Select file to add items to your collection: ${collection}`
                : 'Your collection is empty, add items to populate it'}
            </span>
            <div className="mt-4 w-96">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      aria-hidden="true"
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload CSV</span>{' '}
                      or drag and drop
                    </p>
                    <ul className="w-full flex-wrap list-disc">
                      <li className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Up to 255 characters per cell
                      </li>
                      <li className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Up to 1GB
                      </li>
                      <li className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Up to 250 columns
                      </li>
                    </ul>
                  </div>
                  <input
                    onDrop={handleDragOver}
                    onChange={handleFileChange}
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OneAiUpload;
export { OneAiUpload };
