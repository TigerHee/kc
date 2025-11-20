import { useEffect, useState } from 'react';
import { getSensorsABResult } from '@utils/sensors';

const abTestMap = {};
/**
 * opt 类型
 *  param_name: AB 参数名称,
    default_value: 默认值,
    value_type: 值类型,
 */
const getABtest = async (opt = {}) => {
  const { param_name } = opt;
  // 如果 abTestMap 中已经有对应 ab 试验缓存的值，则直接返回
  if (typeof abTestMap[param_name]?.value !== 'undefined') {
    return abTestMap[param_name]?.value;
  }
  // 如果 abTestMap 中已经有对应 ab 试验缓存的 promise，则直接返回
  if (typeof abTestMap[param_name]?.promise !== 'undefined') {
    return abTestMap[param_name]?.promise;
  }
  abTestMap[param_name] = {};
  const promise = getSensorsABResult(opt)
    .then((data) => {
      // 将当前 ab 试验的值存入 abTestMap 中
      abTestMap[param_name].value = data;
      // 清除当前 ab 试验的 promise
      abTestMap[param_name].promise = undefined;
      // 返回试验值
      return data;
    })
    .catch(() => {
      abTestMap[param_name].value = undefined;
      return false;
    });
  // 将当前 ab 试验 promise 存入 abTestMap 中
  abTestMap[param_name].promise = promise;
  // 返回 promise
  return abTestMap[param_name].promise;
};

// 手机号注册绑定邮箱 AB
export function useRegisterPhoneBindEmailABtest() {
  // 默认值是false
  const [inWhiteList, setInWhiteList] = useState(false);

  useEffect(() => {
    getABtest({
      param_name: 'inWhiteList',
      default_value: false,
      value_type: 'Boolean',
    }).then((data) => {
      console.log('ab test data:', data);
      setInWhiteList(() => data);
    });
  }, []);

  return inWhiteList;
}
