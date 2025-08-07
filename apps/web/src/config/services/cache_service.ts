interface CacheOptions {
  expirationMs?: number;
  forceRefresh?: boolean;
  fetchOptions?: RequestInit; // Add support for fetch options
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export const fetchWithLocalCache = async <T>(
  url: string,
  options: CacheOptions = {}
): Promise<T> => {
  const { expirationMs = 3600000, forceRefresh = false, fetchOptions = {} } = options;
  const cacheKey = `cache_${url}`;

  try {
    if (!forceRefresh) {
      const cachedItem = localStorage.getItem(cacheKey);
      if (cachedItem) {
        try {
          const { data, timestamp }: CacheItem<T> = JSON.parse(cachedItem);
          const isValid = Date.now() - timestamp < expirationMs;

          if (isValid) {
            return data;
          }
        } catch (parseError) {
          console.error(`Error parsing cached item for ${url}:`, parseError);
          // Continue to fetch fresh data if parsing fails
        }
      }
    }

    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (storageError) {
      console.warn(`Failed to cache response for ${url}:`, storageError);
      // Continue even if caching fails (might be due to storage limits)
    }
    
    return data;
  } catch (error) {
    console.error(`Cache fetch error for ${url}:`, error);
    throw error;
  }
};

export const clearCache = (url?: string): void => {
  try {
    if (url) {
      localStorage.removeItem(`cache_${url}`);
    } else {
      // Clear all cache entries (only those with our prefix)
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// Add a new function to check if an item is cached and valid
export const isCached = (url: string, expirationMs = 3600000): boolean => {
  try {
    const cacheKey = `cache_${url}`;
    const cachedItem = localStorage.getItem(cacheKey);
    
    if (!cachedItem) return false;
    
    const { timestamp } = JSON.parse(cachedItem);
    return Date.now() - timestamp < expirationMs;
  } catch (error) {
    console.error(`Error checking cache for ${url}:`, error);
    return false;
  }
};

// Cache namespaces to organize and manage cache by feature
export enum CacheNamespace {
  STUDENT = 'student',
  COLLEGE = 'college',
  DEPARTMENT = 'department',
  COMPANY = 'company',
  PLACEMENT = 'placement',
}

// Create a cache key with namespace for better organization
export const createCacheKey = (namespace: CacheNamespace, key: string): string => {
  return `cache_${namespace}_${key}`;
};

// Function to invalidate cache by namespace
export const invalidateNamespaceCache = (namespace: CacheNamespace): void => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`cache_${namespace}_`)) {
        localStorage.removeItem(key);
      }
    });
    console.log(`Cache invalidated for namespace: ${namespace}`);
  } catch (error) {
    console.error(`Error invalidating ${namespace} cache:`, error);
  }
};

// Enhanced fetch function with namespace support
export const fetchWithNamespaceCache = async <T>(
  url: string,
  namespace: CacheNamespace,
  options: CacheOptions = {}
): Promise<T> => {
  const { expirationMs = 3600000, forceRefresh = false, fetchOptions = {} } = options;
  const cacheKey = createCacheKey(namespace, url);

  try {
    if (!forceRefresh) {
      const cachedItem = localStorage.getItem(cacheKey);
      if (cachedItem) {
        try {
          const { data, timestamp }: CacheItem<T> = JSON.parse(cachedItem);
          const isValid = Date.now() - timestamp < expirationMs;

          if (isValid) {
            return data;
          }
        } catch (parseError) {
          console.error(`Error parsing cached item for ${url}:`, parseError);
          // Continue to fetch fresh data if parsing fails
        }
      }
    }

    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (storageError) {
      console.warn(`Failed to cache response for ${url}:`, storageError);
      // Continue even if caching fails (might be due to storage limits)
    }
    
    return data;
  } catch (error) {
    console.error(`Cache fetch error for ${url}:`, error);
    throw error;
  }
};

// Check if data needs to be refreshed based on last update time from server
export const shouldRefreshData = (
  url: string, 
  namespace: CacheNamespace, 
  serverLastUpdated: number
): boolean => {
  try {
    const cacheKey = createCacheKey(namespace, url);
    const cachedItem = localStorage.getItem(cacheKey);
    
    if (!cachedItem) return true;
    
    const { timestamp } = JSON.parse(cachedItem);
    return serverLastUpdated > timestamp;
  } catch (error) {
    console.error(`Error checking cache freshness for ${url}:`, error);
    return true; // If there's an error, better to refresh
  }
};

// Cache keys for student data
export const StudentCacheKeys = {
  PROFILE: 'student_profile',
  JOBS: 'student_jobs',
  APPLICATIONS: 'student_applications',
  OFFERS: 'student_offers',
  DASHBOARD_STATS: 'student_dashboard_stats',
  ELIGIBILITY: 'student_eligibility',
  RECOMMENDATIONS: 'student_recommendations'
};

// Function to check if server data is newer than cache
export const isServerDataNewer = (
  cacheKey: string, 
  serverLastUpdated: number | string
): boolean => {
  try {
    const cachedItem = localStorage.getItem(cacheKey);
    if (!cachedItem) return true;
    
    const { timestamp } = JSON.parse(cachedItem);
    const serverTimestamp = typeof serverLastUpdated === 'string' 
      ? Date.parse(serverLastUpdated)
      : serverLastUpdated;
      
    return serverTimestamp > timestamp;
  } catch (error) {
    console.error(`Error checking cache freshness for ${cacheKey}:`, error);
    return true; // If there's an error, better to refresh data
  }
};

// Clear all student-related cache
export const clearAllStudentCache = (): void => {
  try {
    Object.values(StudentCacheKeys).forEach(key => {
      Object.keys(localStorage).forEach(storageKey => {
        if (storageKey.includes(`cache_${key}`)) {
          localStorage.removeItem(storageKey);
        }
      });
    });
    console.log('All student cache cleared');
  } catch (error) {
    console.error('Error clearing student cache:', error);
  }
};

// Clear specific student cache category
export const clearStudentCache = (cacheCategory: string): void => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.includes(`cache_${cacheCategory}`)) {
        localStorage.removeItem(key);
      }
    });
    console.log(`Student ${cacheCategory} cache cleared`);
  } catch (error) {
    console.error(`Error clearing student ${cacheCategory} cache:`, error);
  }
};

// Student-specific fetch with cache that checks server for updates
export const fetchStudentData = async <T>(
  url: string,
  cacheCategory: string,
  options: CacheOptions = {}
): Promise<T> => {
  const { expirationMs = 3600000, forceRefresh = false, fetchOptions = {} } = options;
  const cacheKey = `cache_${cacheCategory}_${url.replace(/[^a-z0-9]/gi, '_')}`;
  
  try {
    // First check if we need to validate cache freshness with the server
    if (!forceRefresh) {
      try {
        // Check if the cache exists and is still valid based on time
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
          const { data, timestamp }: CacheItem<T> = JSON.parse(cachedItem);
          const isValid = Date.now() - timestamp < expirationMs;

          if (isValid) {
            // For critical data, check if server has newer data before using cache
            if (cacheCategory === StudentCacheKeys.PROFILE || 
                cacheCategory === StudentCacheKeys.APPLICATIONS ||
                cacheCategory === StudentCacheKeys.OFFERS) {
              // Quick metadata check with the server to see if data has changed
              // // const metaCheckUrl = `${url.split('?')[0]}/meta`;
              // // const metaResponse = await fetch(metaCheckUrl, {
              // //   method: 'HEAD',
              // //   headers: {
              // //     ...fetchOptions.headers,
              // //     'If-Modified-Since': new Date(timestamp).toUTCString()
              // //   }
              // // });
              
              // // If server responds with 304 Not Modified, use the cache
              // if (metaResponse.status === 304) {
              //   return data;
              // }
            } else {
              // For less critical data, just use the cache based on time
              return data;
            }
          }
        }
      } catch (parseError) {
        console.error(`Error parsing cached item for ${url}:`, parseError);
        // Continue to fetch fresh data if parsing fails
      }
    }

    // Fetch fresh data from server
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (storageError) {
      console.warn(`Failed to cache response for ${url}:`, storageError);
      // Continue even if caching fails (might be due to storage limits)
    }
    
    return data;
  } catch (error) {
    console.error(`Student cache fetch error for ${url}:`, error);
    throw error;
  }
};

