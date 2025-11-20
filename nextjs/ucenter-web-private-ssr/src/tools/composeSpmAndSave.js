/**
 * Owner: willen@kupotech.com
 */
import { addLangToPath } from 'src/tools/i18n';
import { compose } from '@/core/telemetryModule';

// saveSpmQueryParam2SessionStorage
export const saveSpm2Storage = (url, spm) => {
  if (window.$KcSensors && window.$KcSensors.spmStorage) {
    let _href = url;
    if (_href.startsWith('/')) {
      _href = `${window.location.origin}${_href}`;
    }
    _href = addLangToPath(_href);
    window.$KcSensors.spmStorage.saveSpm2SessionStorage(_href, spm);
  }
};

export const composeSpmAndSave = (url, spms) => {
  if (!spms) return;
  const spm = compose(spms);
  if (!spm) return;
  saveSpm2Storage(url, spm);
};
