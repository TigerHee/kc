/**
 * Owner: garuda@kupotech.com
 */
function getKeyPrefix(options: { name: any; storeName: any }, defaultConfig: { storeName: any }) {
  let keyPrefix = `${options.name}/`;
  if (options.storeName !== defaultConfig.storeName) {
    keyPrefix += `${options.storeName}/`;
  }
  return keyPrefix;
}
export default getKeyPrefix;
