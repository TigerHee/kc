/**
 * Owner: willen@kupotech.com
 */
import { filter, noop } from 'lodash-es';

export const arrayTreeFilter = (data = [], filterFn = noop, options = {}) => {
  options = options || {};
  options.childrenKeyName = options.childrenKeyName || 'children';
  let children = data || [];
  const result = [];
  let level = 0;
  const fs = (v) => filterFn(v, level);
  // let foundItem;
  do {
    const foundItem = filter(children, (item) => {
      return fs(item);
    })[0];
    if (!foundItem) {
      break;
    }
    result.push(foundItem);
    children = foundItem[options.childrenKeyName] || [];
    level += 1;
  } while (children.length > 0);
  return result;
};
