/**
 * Owner: mike@kupotech.com
 */

import { PageSize } from './constant';

const ALL = 'ALL';
/**
 * @description: 格式化提交数据
 * @param filterData
 * @return {*}
 */
export const formatDataForSubmit = (filterData) => {
  const { templateType, tab, code } = filterData;
  const condition = filterData.condition;
  const criteria = [];
  const submitData = {
    criteria,
    sort: {
      direction: 'DESC',
      field: tab,
    },
    currentPage: 0,
    pageSize: PageSize,
  };
  if (code && code !== ALL) {
    const codeOP = {
      field: 'currency',
      op: '=',
      value: code,
    };
    submitData.criteria.push(codeOP);
  }
  if (templateType && templateType !== ALL) {
    const templateTypeOP = {
      field: 'templateType',
      op: '=',
      value: String(templateType),
    };
    submitData.criteria.push(templateTypeOP);
  }
  const effectiveCondition = Object.values(condition).filter((cd) => cd !== ALL);
  submitData.criteria = submitData.criteria.concat(effectiveCondition);
  return submitData;
};

/**
 * @description: 将对象映射唯一的Symbol ID
 * @return {*}
 */
const cacheMap = new Map();
let uniqueIndex = 0;
export const objectToID = (data) => {
  const str = JSON.stringify(data);
  if (cacheMap.has(str)) {
    return cacheMap.get(str);
  }
  const uniqueKey = Symbol(str.slice(0, 4));
  uniqueIndex += 1;
  const idInfo = {
    uniqueKey,
    uniqueIndex,
  };
  cacheMap.set(str, idInfo);
  return idInfo;
};
