/**
 * Owner: mike@kupotech.com
 */
import { useRef } from 'react';
import { pick, isEmpty, debounce } from 'lodash';
import useStateRef from '@/hooks/common/useStateRef';
/**
 * @description: 转换成相同的基本类型比较
 * @param {*} descriptor
 * @param {*} data
 * @return {*}
 */
const typeTransformer = (descriptor, data) => {
  Object.keys(data).forEach((key) => {
    if (descriptor[key] === 'string') {
      if (typeof data[key] !== 'string') {
        data[key] = String(data[key]);
      }
    } else if (descriptor[key] === 'number') {
      if (typeof data[key] !== 'number') {
        data[key] = Number(data[key]);
      }
    } else if (descriptor[key] === 'boolean') {
      if (typeof data[key] !== 'boolean') {
        data[key] = Boolean(data[key]);
      }
    } else {
      data[key] = String(data[key]);
    }
  });
  return data;
};
/**
 * @description: 判断参数是否发生变化
 * @param {object} formData 本次的值
 * @param {object} lastTimeFormData 记录上次的值
 * @param {object<key, type>?} compareKeys 要比较的key, 缺失就是直接按照字符串类型比较所有数据
 * @return {boolean}
 */
const paramsChange = (formData = {}, lastTimeFormData = {}, compareKeyDescriptor = {}) => {
  const compareKeys = Object.keys(isEmpty(compareKeyDescriptor) ? formData : compareKeyDescriptor);
  let compareGroupCurrent = pick(formData, compareKeys);
  let compareGroupLast = pick(lastTimeFormData, compareKeys);

  // 现将数据转换成相同的数据类型, 再比较
  compareGroupCurrent = typeTransformer(compareKeyDescriptor, compareGroupCurrent);
  compareGroupLast = typeTransformer(compareKeyDescriptor, compareGroupLast);

  //   return !isEqual(compareGroupCurrent, compareGroupLast);
  const diffObj = {};
  compareKeys.forEach((key) => {
    if (compareGroupCurrent[key] !== compareGroupLast[key]) {
      diffObj[key] = formData[key];
    }
  });
  return {
    isChanged: !isEmpty(diffObj),
    diffObj,
  };
};

/**
 * @description: 数据驱动, 检测变化, 截流处理next函数
 * @param {object} currentValues
 * @param {object?} compareKeyDescriptor {key: string|number|boolean}
 * @param {function} next
 * @return {*}
 */
function useWatch(...rest) {
  const [currentValues, compareKeyDescriptor, next] = rest;
  const callback =
    compareKeyDescriptor && typeof compareKeyDescriptor === 'function'
      ? compareKeyDescriptor
      : next;
  const KeyDescriptor =
    compareKeyDescriptor && typeof compareKeyDescriptor === 'object' ? compareKeyDescriptor : {};
  const lastValuesRef = useRef(currentValues);
  const { isChanged, diffObj } = paramsChange(currentValues, lastValuesRef.current, KeyDescriptor);
  const useLatestNextRef = useStateRef(callback);
  const nextDounceRef = useRef(
    debounce((changedParams) => {
      useLatestNextRef.current(changedParams);
    }, 100),
  );
  if (isChanged) {
    lastValuesRef.current = currentValues;
    nextDounceRef.current(diffObj);
  }
}

export default useWatch;
