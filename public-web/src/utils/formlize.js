/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';

/**
 * 对象转表单数据
 * @param obj
 * @returns {*}
 */
export default (obj) => {
  if (obj instanceof FormData) {
    return obj;
  }
  const form = new FormData();
  _.each(obj, (value, key) => {
    if (typeof value !== 'undefined') {
      form.append(key, value);
    }
  });
  return form;
};
