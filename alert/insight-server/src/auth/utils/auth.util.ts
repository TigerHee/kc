import { promises as fs } from 'fs';

const cachePath = './.cache/tokenCache.json';

const beforeCacheAccess = async (cacheContext) => {
  cacheContext.tokenCache.deserialize(await fs.readFile(cachePath, 'utf-8'));
};

const afterCacheAccess = async (cacheContext) => {
  if (cacheContext.cacheHasChanged) {
    await fs.writeFile(cachePath, cacheContext.tokenCache.serialize());
  }
};

// Cache Plugin
const cachePlugin = {
  beforeCacheAccess,
  afterCacheAccess,
};

export { cachePlugin, cachePath };
