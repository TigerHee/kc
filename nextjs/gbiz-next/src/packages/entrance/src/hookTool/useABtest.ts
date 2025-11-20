/**
 * Owner: sean.shi@kupotech.com
 */
/* eslint-disable prototype-pollution/no-bracket-notation-property-accessor */
import { useEffect, useState } from 'react';
import { getSensorsABResult } from 'tools/sensors';

// Define interfaces
interface ABTestOption {
  param_name: string;
  default_value: any;
  value_type: string;
}

interface ABTestMapItem {
  value?: any;
  promise?: Promise<any>;
}

interface ABTestMap {
  [key: string]: ABTestMapItem;
}

// Create a typed abTestMap
const abTestMap: ABTestMap = {};

const getABtest = async (opt: ABTestOption): Promise<any> => {
  const { param_name } = opt;

  if (typeof abTestMap[param_name]?.value !== 'undefined') {
    return abTestMap[param_name]?.value;
  }

  if (typeof abTestMap[param_name]?.promise !== 'undefined') {
    return abTestMap[param_name]?.promise;
  }

  abTestMap[param_name] = {};
  const promise = getSensorsABResult(opt)
    .then((data: any) => {
      abTestMap[param_name].value = data;
      abTestMap[param_name].promise = undefined;
      return data;
    })
    .catch(() => {
      abTestMap[param_name].value = undefined;
      return false;
    });

  abTestMap[param_name].promise = promise;
  return abTestMap[param_name].promise;
};

// Modified hook to use Zustand
export function useRegisterPhoneBindEmailABtest(): boolean {
  const [inWhiteList, setInWhiteList] = useState(false);

  useEffect(() => {
    getABtest({
      param_name: 'inWhiteList',
      default_value: false,
      value_type: 'Boolean',
    }).then((data: boolean) => {
      console.log('ab test data:', data);
      setInWhiteList(data);
    });
  }, [setInWhiteList]);

  return inWhiteList;
}
