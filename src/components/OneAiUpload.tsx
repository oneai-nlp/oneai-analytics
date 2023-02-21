import React, { useEffect, useRef, useState } from 'react';
import { UploadParams } from '../common/types/componentsInputs';
import Papa from 'papaparse';

const allowedExtensions = ['csv'];

const OneAiUpload = ({
  apiKey,
  domain,
  collection,
  darkMode = true,
}: UploadParams) => {
  const [data, setData] = useState([] as string[][]);
  const [error, setError] = useState(null as string | null);
  const [file, setFile] = useState(null as File | null);
  const [parseFinished, setParseFinished] = useState(false);
  const currentParser = useRef(null as Papa.Parser | null);

  useEffect(() => {
    handleParse();
  }, [file]);

  const handleFileChange = (e: { target: { files: FileList | null } }) => {
    setError(null);
    setParseFinished(false);
    try {
      currentParser.current?.abort();
    } catch (e) {
      console.log(e);
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
  };

  const handleParse = () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError('Enter a valid file');

    Papa.parse(file, {
      worker: true, // Don't bog down the main thread if its a big file
      step: function ({ data, errors }, parser) {
        if (errors.length > 0) {
          setError(errors[0].message);
          parser.abort();
          return;
        }

        currentParser.current = parser;
        setData((prev) => [...prev, data as string[]]);
      },
      complete: function (results, file) {
        console.log('parsing complete read', results, file);
        setParseFinished(true);
      },
    });
  };

  return (
    <div
      className={`oneai-analytics-namespace h-full w-full ${
        darkMode ? 'dark' : ''
      }`}
    >
      <div className="h-full w-full overflow-hidden bg-[#272535] flex flex-col items-center text-white">
        {parseFinished ? (
          <div className="w-full h-full p-2">
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setError(null);
                setData([]);
                setParseFinished(false);
              }}
              className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Reset
            </button>
            <div className="relative overflow-auto shadow-md sm:rounded-lg h-[90%]">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                  <tr>
                    {data[0].map((header) => (
                      <th key={header} scope="col" className="px-6 py-3">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(1).map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      {row.map((cell, i) => (
                        <td key={i} className="px-6 py-4">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <span className="mt-36">
              Your collection is empty, add items to populate it
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
