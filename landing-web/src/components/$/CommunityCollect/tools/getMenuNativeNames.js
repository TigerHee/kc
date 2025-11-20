import { isArray } from 'lodash';

/**
 * Owner: lucas.l.lu@kupotech.com
 */
export function getMenuNativeNames(config) {
  if (!isArray(config)) {
    return [];
  }

  return config.map(item => {
    return {
      nativeName: item.nativeName,
      language: item.language,
    };
  });
}
