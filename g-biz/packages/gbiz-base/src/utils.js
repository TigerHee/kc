/**
 * Owner: iron@kupotech.com
 */
import each from 'lodash/each';

/**
 * 对象转表单数据
 * @param obj
 * @returns {*}
 */
export const formlize = (obj) => {
  if (obj instanceof FormData) {
    return obj;
  }
  const form = new FormData();
  each(obj, (value, key) => {
    if (typeof value !== 'undefined') {
      form.append(key, value);
    }
  });
  return form;
};

export const getImgBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

// uuid 生产
export const generateUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
