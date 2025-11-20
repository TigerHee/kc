/**
 * Owner: iron@kupotech.com
 */
import { indexOf } from 'lodash-es';
import remoteEvent from 'tools/remoteEvent';

export const kcsensorsClick = (spm, data = {}) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    sensors.trackClick(spm, data);
  });
};

export const kcsensorsManualTrack = (type = 'expose', spm = [], data = {}) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    const site_id = sensors?.spm?.getSiteId();
    const exposeCfg = {
      site_id,
      spm_id: sensors?.spm?.compose(spm),
      ...data,
    };
    sensors?.track(type, exposeCfg);
  });
};

export const compose = (spm = []) => {
  let spmId = '';
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    if (spm) {
      const siteId = sensors?.spm?.getSiteId();
      const pageId = sensors?.spm?.getPageId();
      if (siteId && pageId) {
        spmId = sensors?.spm?.compose(spm);
      }
    }
  });
  return spmId;
};

// 向url添加参数
const updateQueryStringParameter = (uri, key, value) => {
  if (!uri || !value) {
    return uri;
  }
  const reg = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = indexOf(uri, '?') > -1 ? '&' : '?';
  if (uri.match(reg)) {
    return uri.replace(reg, `$1${key}=${value}$2`);
  }

  return `${uri}${separator}${key}=${value}`;
};

// 向query参数中添加spm
export const addSpmIntoQuery = (url, spms) => {
  const spm = compose(spms);
  if (!spm) return url;
  return updateQueryStringParameter(url, 'spm', spm);
};

export function searchToJson(search) {
  if (!search) {
    search = window.location.search.slice(1);
  }
  const temp = {};
  if (search) {
    try {
      const arr = search.split('&');
      // eslint-disable-next-line no-restricted-syntax
      for (const key in arr) {
        if (Object.prototype.hasOwnProperty.call(arr, key)) {
          const str = arr[key];
          const at = str.indexOf('=');
          const k = str.substring(0, at);
          const v = decodeURIComponent(decodeURI(str.substring(at + 1)));
          temp[k] = v;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  return temp;
}

export const getImgBase64 = (img) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', reject);
    reader.readAsDataURL(img);
  });
};
