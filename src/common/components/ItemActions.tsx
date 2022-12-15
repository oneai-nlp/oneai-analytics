import { Dialog, RadioGroup, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { NodeType } from '../types/componentsInputs';

export default function ItemActions({
  node,
  searchSimilarClusters,
  splitPhrase,
  mergeClusters,
}: {
  node: { type: NodeType; id: string; text: string } | null;
  searchSimilarClusters?: (
    text: string,
    controller: AbortController
  ) => Promise<{ id: string; text: string }[]>;
  splitPhrase?: (
    phraseId: string,
    controller: AbortController
  ) => Promise<{ status: 'Success' | 'error'; message: string }>;
  mergeClusters?: (
    source: string,
    destination: string,
    controller: AbortController
  ) => Promise<{ status: 'Success' | 'error'; message: string }>;
}) {
  const controller = useRef(null as AbortController | null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null as 'Split' | 'Merge' | null);
  const [similarClusters, setSimilarClusters] = useState(
    null as { id: string; text: string }[] | null
  );
  const [selectedCluster, setSelectedCluster] = useState(
    null as { id: string; text: string } | null
  );
  const [searchText, setSearchText] = useState(null as string | null);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    if (!node || !searchSimilarClusters) return;
    if (node.type === 'Cluster') {
      setAction('Merge');
      setSearchText('');
    } else if (node.type === 'Phrase') {
      setAction('Split');
    }
    setIsOpen(true);
  }, [node]);

  useEffect(() => {
    if (controller.current && !isOpen) controller.current.abort();
    if (!isOpen) {
      setError(null);
      setLoading(false);
      setAction(null);
      setSimilarClusters(null);
      setSelectedCluster(null);
      setSearchText(null);
      controller.current = new AbortController();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchText === null || !node || !searchSimilarClusters) return;
    const fetchData = async (controller: AbortController) => {
      try {
        setLoading(true);
        const res = await searchSimilarClusters(
          searchText === '' ? node.text : searchText,
          controller
        );
        setSimilarClusters(res);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    const currentController = new AbortController();
    fetchData(currentController).catch((e) => {
      console.error(e);
    });

    return () => {
      currentController.abort();
    };
  }, [searchText, node, searchSimilarClusters]);

  function closeModal() {
    setIsOpen(false);
  }

  async function invokeAction() {
    if (!splitPhrase || !mergeClusters || !controller.current || !node)
      return closeModal();
    setError(null);
    setLoading(true);
    if (action === 'Split') {
      const res = await splitPhrase(node.id, controller.current);
      if (res.message) {
        setError(res.message);
      } else {
        closeModal();
      }
    } else {
      if (selectedCluster) {
        const res = await mergeClusters(
          node.id,
          selectedCluster.id,
          controller.current
        );
        if (res.message) {
          setError(res.message);
        } else {
          closeModal();
        }
      }
    }
    setLoading(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#272535] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-center text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  {action === 'Merge' ? (
                    <div>Merging:</div>
                  ) : (
                    <span>Split to a new cluster:</span>
                  )}
                  <span className="group relative flex w-full">
                    "<span className="truncate">{node?.text}</span>"
                    <span className="absolute hidden group-hover:flex -left-5 -translate-y-full px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                      {node?.text}
                    </span>
                  </span>
                </Dialog.Title>
                {error && (
                  <p
                    id="filled_error_help"
                    className="mt-2 text-xs text-red-600 dark:text-red-400"
                  >
                    <span className="font-medium">Oh, snapp!</span> {error}
                  </p>
                )}
                {searchText !== null && (
                  <div>
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      id="search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search for clusters"
                      required
                    />
                  </div>
                )}
                {loading ? (
                  <div className="grow w-full justify-center items-center flex mt-1">
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
                ) : (
                  similarClusters && (
                    <div className="overflow-y-auto max-h-64">
                      <ClustersList
                        clusters={similarClusters.filter(
                          (c) => c.id.toString() !== node?.id
                        )}
                        selected={selectedCluster}
                        clusterSelected={setSelectedCluster}
                      />
                    </div>
                  )
                )}

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className="text-center w-1/3 rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    onClick={invokeAction}
                    disabled={loading || !selectedCluster}
                  >
                    {action}
                  </button>
                  <button
                    type="button"
                    className="text-center w-1/3 rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function ClustersList({
  clusters,
  selected,
  clusterSelected,
}: {
  clusters: { id: string; text: string }[];
  selected: { id: string; text: string } | null;
  clusterSelected: (cluster: { id: string; text: string }) => void;
}) {
  return (
    <div className="w-full px-4 py-2">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected} onChange={clusterSelected}>
          <RadioGroup.Label className="sr-only">
            Select Destination Cluster
          </RadioGroup.Label>
          <div className="space-y-2">
            {clusters.map((cluster) => (
              <RadioGroup.Option
                key={cluster.id}
                value={cluster}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                      : ''
                  }
                  ${
                    checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {cluster.id}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-sky-100' : 'text-gray-500'
                            }`}
                          >
                            <span>{cluster.text}</span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function CheckIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
