/**
 * Owner: melon@kupotech.com
 * * 迁移自`src/hooks/useSensors.js`
 */
const fastFetchABTest = async (options) => {
  const _config = options || {};
  return import('@kc/sensors').then(res => {
    const sensors = res?.default || res;
    if (sensors) {
    if (!sensors?.fastFetchABTest) return Promise.reject('abtest sdk is not exist');
      return sensors?.fastFetchABTest(_config);
    }
    return Promise.resolve(_config.default_value);
  })
};

export const getSensorsABResult = async ({ param_name, default_value = '' }) => {
  try {
    // 神策abTest查询是否展示目标页面
    const data = await fastFetchABTest({
      param_name,
      default_value,
      value_type: 'String',
    });
    return data;
  } catch (err) {
    return default_value;
  }
};
