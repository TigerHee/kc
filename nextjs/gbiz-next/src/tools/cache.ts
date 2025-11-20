import { LRUCacheWrapper } from "kc-next/lru-cache";
const cache = new LRUCacheWrapper({
  max: 2000,
  maxSize: 100 * 1024 * 1024, // 100MB
  ttl: 5 * 60 * 1000, // 5 minutes
});

export default cache;
