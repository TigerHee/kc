/**
 * Owner: harry.lai@kupotech.com
 */

export const isRelativedTWAPNamespace = (namespace) => {
  return ['orderTwap', 'orderTwapHistory'].includes(namespace);
};
