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

