/**
 * Owner: Ray.Lee@kupotech.com
 */
import {useEffect, useState} from 'react';

import {sensorBridge} from '@krn/bridge';
import {compareVersion, getNativeInfo} from 'utils/helper';

const AB_OLD = '0';
const AB_NEW = '1';
const SENSOR_VERSION = '3.108.0';

/**
 * ab test
 */
const useAbTest = AB_KEY => {
  const [ab, setAb] = useState('');

  const getAb = async () => {
    try {
      // 小于 3.108.0 直接走老版本
      const {version} = await getNativeInfo();
      if (compareVersion(version, SENSOR_VERSION) < 0) {
        setAb(AB_OLD);
        return;
      }
      if (sensorBridge && sensorBridge.fastFetchStringTest) {
        const data = await sensorBridge.fastFetchStringTest(AB_KEY, AB_OLD);
        // 防止神策配置编辑错误导致匹配不到，用 AB_OLD 兜底
        const _ab = [AB_OLD, AB_NEW].includes(data) ? data : AB_OLD;

        setAb(_ab);
      }
    } catch (error) {
      setAb(AB_OLD);
    }
  };

  useEffect(() => {
    getAb();
  }, []);

  return {
    AB_TEST: ab,
    AB_OLD,
    AB_NEW,
  };
};

export default useAbTest;
