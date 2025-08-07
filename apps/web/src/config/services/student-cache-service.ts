"use client";
import { useState, useEffect, useCallback } from 'react';
import { fetchStudentData as fetchStudentDataOriginal, StudentCacheKeys as OriginalStudentCacheKeys, clearStudentCache as originalClearStudentCache } from './cache_service';

// Re-export the original cache keys
export const StudentCacheKeys = OriginalStudentCacheKeys;

// Re-export the original clearStudentCache function
export const clearStudentCache = originalClearStudentCache;

// Re-export the original fetchStudentData function
export const fetchStudentData = fetchStudentDataOriginal;

// Create a custom hook for easily fetching student data with caching
export function useStudentData<T>(
  endpoint: string,
  cacheKey: string,
  cacheExpirationMs = 3600000, // 1 hour default cache
  initialData: T | null = null
): [T | null, boolean, Error | null, () => Promise<void>] {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Clear cache if force refresh is requested
      if (forceRefresh) {
        clearStudentCache(cacheKey);
      }

      const response = await fetchStudentDataOriginal<T>(
        endpoint,
        cacheKey,
        {
          
          expirationMs: cacheExpirationMs,
          fetchOptions:{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        }
      );

      setData(response);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [endpoint, cacheKey, cacheExpirationMs]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return data, loading state, error, and a function to refresh data
  return [data, loading, error, () => fetchData(true)];
}

// Helper function to invalidate specific student cache
export const invalidateStudentCache = (cacheKey: string): void => {
  clearStudentCache(cacheKey);
};

// Helper function to invalidate all student caches
export const invalidateAllStudentCaches = (): void => {
  Object.values(StudentCacheKeys).forEach(key => {
    clearStudentCache(key);
  });
};
