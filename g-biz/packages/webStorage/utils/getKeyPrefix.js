/**
 * Owner: garuda@kupotech.com
 */
function getKeyPrefix(options, defaultConfig) {
  let keyPrefix = `${options.name}/`;
  if (options.storeName !== defaultConfig.storeName) {
    keyPrefix += `${options.storeName}/`;
  }
  return keyPrefix;
}
export default getKeyPrefix;
