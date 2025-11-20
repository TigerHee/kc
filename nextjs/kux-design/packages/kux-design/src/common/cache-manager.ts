interface ICacheItem<T> {
  /**
   * cached value
   */
  value: T;
  /**
   * time to live, in milliseconds
   */
  timeout?: number;
  /**
   * expiry time
   */
  expiry?: number;
};

const cache: Record<string, ICacheItem<any>> = {};

/**
 * add a cache item
 * @param key cache key
 * @param value cached value
 * @param ttl time to live, in milliseconds, default to 0 (no expiration)
 * @returns void
 */
function add<T>(key: string, value: T, ttl?: number): void {
  if (!ttl) {
    cache[key] = { value };
    return
  } else {
    cache[key] = { value, timeout: ttl, expiry: Date.now() + ttl };
  }
}

/**
 * get a cache item by key
 * @param key cache key
 * @returns cached value
 */
function get<T>(key: string): T | undefined {
  const cacheItem = cache[key];
  if (!cacheItem) return;
  if (tryExpire(key, cacheItem)) return;
  return cacheItem.value;
}

/**
 * remove a cache item by key
 * @param key cache key
 */
function remove (key: string): void  {
  delete cache[key];
}

/**
 * try to expire a cache item
 * @param key cache key
 * @param cacheItem cached item
 * @returns  true if the item is expired and removed, false otherwise
 */
function tryExpire<T>(key: string, cacheItem: ICacheItem<T>)  {
  if (!cacheItem.timeout) return false;
  const now = Date.now();
  if (now > cacheItem.expiry!) {
    remove(key);
    return true;
  } else {
    // extend the expiry time
    cacheItem.expiry = now + cacheItem.timeout;
    return false;
  }
}

/**
 * clear all cache items
 */
function clear () {
  for (const key in cache) {
    delete cache[key];
  }
}

/**
 * try to get cache, if not found, get value from getValue and cache it
 * @param key cached key
 * @param getValue method to get value
 * @param ttl time to live, in milliseconds, default to 0 (no expiration)
 * @returns 
 */
function tryGetCache<T>(key: string, getValue: () => T, ttl?: number): T {
  const val = get(key);
  // if the value is found, return it
  if (!app.is(val, 'undefined')) return val as T;
  const value = getValue();
  add(key, value, ttl);
  return value; 
}

export const cacheManager = {
  add,
  get,
  tryGetCache,
  remove,
  clear,
}
