/**
 * Owner: borden@kupotech.com
 */

import _ from 'lodash';
import { DEFAULT_LANG, siteCfg } from 'config';

/** CMS Components CSS */
export function genComponentCssPath(currentLang, componentsToLoad) {
  const _comKeys = _.reduce(componentsToLoad, (result, arr) => {
    let langArr = _.map(arr, key => `${key}@${currentLang}`);
    if (currentLang !== DEFAULT_LANG) {
      const enArr = _.map(arr, key => `${key}@${DEFAULT_LANG}`);
      langArr = langArr.concat(enArr);
    }
    return result.concat(langArr);
  }, []);
  const _comKeyArgs = encodeURIComponent(JSON.stringify(_comKeys));

  return `${siteCfg.MAINSITE_HOST || ''}/component/css?keys=${_comKeyArgs}`;
}
