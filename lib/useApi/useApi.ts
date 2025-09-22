import { useCallback, useRef } from 'react';

interface FetchConfig extends RequestInit {
  params?: Record<string, string>;
}

const defaults = {
  baseURL: location != null ? location.href : '/',
  headers: {
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
    Expires: '-1',
  },
  credentials: 'include' as RequestCredentials,
};

/**
 * Custom hook for making HTTP requests using fetch.
 * @param {string} [rootUrl] - The base URL for requests.
 * @returns {object} - An object containing methods for HTTP requests and query functions.
 */
export function useApi(rootUrl?: string) {
  const baseURL = rootUrl ?? defaults.baseURL;
  const headers = useRef<Record<string, string>>({ ...defaults.headers });
  const jwtToken = useRef<string | null>(null);

  /**
   * Sets a header for the fetch requests.
   * @param {string} name - The name of the header.
   * @param {string} value - The value of the header.
   */
  const setHeader = useCallback((name: string, value: string) => {
    headers.current[name] = value;
  }, []);

  /**
   * Removes a header from the fetch requests.
   * @param {string} name - The name of the header to remove.
   */
  const removeHeader = useCallback((name: string) => {
    delete headers.current[name];
  }, []);

  /**
   * Sets the JWT token for the Authorization header.
   * @param {string} token - The JWT token.
   */
  const setJwtToken = useCallback((token: string) => {
    jwtToken.current = token;
  }, []);

  /**
   * Handles errors from fetch requests.
   * @param {Response} response - The fetch response.
   * @throws {Error} - Throws an error if the response is not ok.
   */
  const handleResponse = useCallback(async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error('Network response was not ok');
    }
    return response.json();
  }, []);

  /**
   * Adds the Authorization header if a JWT token is set.
   */
  const addAuthorizationHeader = useCallback(() => {
    if (jwtToken.current) {
      headers.current['Authorization'] = `Bearer ${jwtToken.current}`;
    } else {
      delete headers.current['Authorization'];
    }
  }, []);

  /**
   * Performs a GET request configured for Tanstack Query.
   * @param {string} endpoint - The endpoint to request.
   * @param {object} params - Query parameters.
   * @param {object} config - Additional fetch configuration.
   * @returns {Promise<any>} - The response data.
   */
  const getQuery = useCallback(
    <T>(endpoint: string, params?: Record<string, string>, config?: FetchConfig) =>
      async ({ signal }: { signal: AbortSignal }): Promise<T> => {
        const url = new URL(endpoint, baseURL);
        if (params) {
          Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
        }
        addAuthorizationHeader();
        try {
          const response = await fetch(url.toString(), {
            method: 'GET',
            headers: headers.current,
            signal,
            ...config,
            credentials: defaults.credentials,
          });
          return handleResponse<T>(response);
        } catch (error) {
          console.error('API request failed:', error);
          throw error;
        }
      },
    [baseURL, handleResponse, addAuthorizationHeader],
  );

  /**
   * Performs a vanilla GET request.
   * @param {string} endpoint - The endpoint to request.
   * @param {object} params - Query parameters.
   * @param {object} config - Additional fetch configuration.
   * @returns {Promise<any>} - The response data.
   */
  const get = useCallback(
    async <T>(endpoint: string, params?: Record<string, string>, config?: FetchConfig): Promise<T> => {
      const url = new URL(endpoint, baseURL);
      if (params) {
        Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
      }
      addAuthorizationHeader();
      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: headers.current,
          ...config,
          credentials: defaults.credentials,
        });
        return handleResponse<T>(response);
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    [baseURL, handleResponse, addAuthorizationHeader],
  );

  /**
   * Performs a vanilla POST request.
   * @param {string} endpoint - The endpoint to request.
   * @param {object} data - The data to send in the request body.
   * @param {object} config - Additional fetch configuration.
   * @returns {Promise<any>} - The response data.
   */
  const post = useCallback(
    async <T>(endpoint: string, data: Record<string, unknown> = {}, config: FetchConfig = {}): Promise<T> => {
      addAuthorizationHeader();
      try {
        const response = await fetch(new URL(endpoint, baseURL).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers.current,
          },
          body: JSON.stringify(data),
          ...config,
          credentials: defaults.credentials,
        });
        return handleResponse<T>(response);
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    [baseURL, handleResponse, addAuthorizationHeader],
  );

  /**
   * Performs a vanilla PUT request.
   * @param {string} endpoint - The endpoint to request.
   * @param {object} data - The data to send in the request body.
   * @param {object} config - Additional fetch configuration.
   * @returns {Promise<any>} - The response data.
   */
  const put = useCallback(
    async <T>(endpoint: string, data: Record<string, unknown> = {}, config: FetchConfig = {}): Promise<T> => {
      addAuthorizationHeader();
      try {
        const response = await fetch(new URL(endpoint, baseURL).toString(), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...headers.current,
          },
          body: JSON.stringify(data),
          ...config,
          credentials: defaults.credentials,
        });
        return handleResponse<T>(response);
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    [baseURL, handleResponse, addAuthorizationHeader],
  );

  /**
   * Performs a vanilla DELETE request.
   * @param {string} endpoint - The endpoint to request.
   * @param {object} data - Query parameters for the request.
   * @param {object} config - Additional fetch configuration.
   * @returns {Promise<any>} - The response data.
   */
  const del = useCallback(
    async <T>(endpoint: string, data?: Record<string, string>, config: FetchConfig = {}): Promise<T> => {
      const url = new URL(endpoint, baseURL);
      if (data) {
        Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));
      }
      addAuthorizationHeader();
      try {
        const response = await fetch(url.toString(), {
          method: 'DELETE',
          headers: headers.current,
          ...config,
          credentials: defaults.credentials,
        });
        return handleResponse<T>(response);
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    [baseURL, handleResponse, addAuthorizationHeader],
  );

  return {
    setHeader,
    removeHeader,
    setJwtToken,
    get,
    getQuery,
    post,
    put,
    delete: del,
  };
}
