/**
 * Owner: solar@kupotech.com
 */
import { useEffect, useState } from 'react';
import remoteEvent from '@tools/remoteEvent';

// 获取神策 ab 结果
export const getSensorsABResult = (options) => {
  const _config = options || {};
  //   if (sensors) {
  //     return sensors.fastFetchABTest(_config);
  //   }
  //   return Promise.resolve(_config.default_value);

  return new Promise((resolve) => {
    remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
      resolve(sensors.fastFetchABTest(_config));
    });
  });
};

export const getABtestResultBySensorKey = async (sensorKey, { defaultValue, valueType }) => {
  if (!sensorKey) return;
  // 默认需要传入 valueType ,推断类型慎用
  const inferValueType = (value) => {
    const str = typeof value;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  try {
    // 请求神策ab 接口
    const data = await getSensorsABResult({
      param_name: sensorKey,
      value_type: valueType || inferValueType(defaultValue),
      default_value: defaultValue,
    });
    return data || defaultValue;
  } catch (err) {
    console.error(`getABtestResultBySensorKey failed! ---> key: ${sensorKey}`, err);
    return defaultValue;
  }
};

export function useAbTest(sensorKey, { defaultValue, valueType }) {
  const [ab, setAb] = useState(null);
  useEffect(() => {
    getABtestResultBySensorKey(sensorKey, {
      defaultValue,
      valueType,
    }).then((data) => setAb(data));
  }, []);
  return ab;
  // return '0';
}

const matchUrl = (pathname, targetUrl) =>
  pathname === targetUrl || pathname?.startsWith?.(`${targetUrl}/`);

/** 判断是否命中 url  */
export const checkIsMatchUrlWithLocation = (location, targetUrls) => {
  const { pathname } = location || {};
  const urls = Array.isArray(targetUrls) ? targetUrls : [targetUrls];
  return urls.some((i) => matchUrl(pathname, i));
};
