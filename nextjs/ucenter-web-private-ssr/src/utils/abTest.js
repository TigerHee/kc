/**
 * Owner: solar@kupotech.com
 */
import sensors from 'gbiz-next/sensors';

// 获取神策 ab 结果
export const getSensorsABResult = (options) => {
  const _config = options || {};
  if (sensors) {
    return sensors.fastFetchABTest(_config);
  }
  return Promise.resolve(_config.default_value);
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
