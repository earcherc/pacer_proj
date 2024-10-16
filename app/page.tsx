'use client';

import { useEffect, useState } from "react";

type Options = {
  offset: number;
  page: number;
  limit: number;
  pagination: boolean;
}

type Response = {
  docs: any[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// More fields available from API
type Launch = {
  id: number;
  name: string;
  date_utc: string;
  success: boolean;
  details: string | null;
};

export default function Home() {
  const [options, setOptions] = useState<Options>({
    offset: 0,
    page: 1,
    limit: 10,
    pagination: true
  });
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchApi = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch('https://api.spacexdata.com/v5/launches/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {},
          options
        })
      });

      const data: Response = await response.json();
      setResponse(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApi();
  }, [options]);

  const handlePageChange = (newPage: number) => {
    setOptions(prev => ({
      ...prev,
      page: newPage,
      offset: (newPage - 1) * prev.limit
    }));
  };

  const handleRetry = () => {
    fetchApi();
  };

  return (
    <div className="w-full">
      <main className="flex flex-col m-4">
        <h1 className="text-2xl font-bold mb-4">SpaceX Launches</h1>

        {response && (
          <div className="flex justify-center items-center gap-4 mb-4">
            <button 
              onClick={() => handlePageChange(response.prevPage || 1)}
              disabled={!response.hasPrevPage}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>Page {response.page} of {response.totalPages}</span>
            <button 
              onClick={() => handlePageChange(response.nextPage || response.totalPages)}
              disabled={!response.hasNextPage}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}

        {loading && (
          <div className="text-xl">
            Loading...
          </div>
        )}
        
        {error && (
          <div className="text-xl text-red-500 mb-4">
            <p>Error: {error.message}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && response && (
          <ul className="w-full">
            {response.docs.map((doc: Launch) => (
              <li key={doc.id} className="mb-6 p-4 border rounded shadow">
                <h2 className="text-xl font-semibold">{doc.name}</h2>
                <p className="text-sm text-gray-600">
                  Date: {new Date(doc.date_utc).toLocaleDateString()}
                </p>
                <p className="mt-2">
                  Status: {doc.success ? 
                    <span className="text-green-600">Successful</span> : 
                    <span className="text-red-600">Failed</span>
                  }
                </p>
                {doc.details && <p className="mt-2">{doc.details}</p>}
              </li>
            ))}
          </ul>
        )}

        {!loading && response && (
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={() => handlePageChange(response.prevPage || 1)}
              disabled={!response.hasPrevPage}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>Page {response.page} of {response.totalPages}</span>
            <button 
              onClick={() => handlePageChange(response.nextPage || response.totalPages)}
              disabled={!response.hasNextPage}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
        
      </main>
    </div>
  );
}
