/*
 * @owner: borden@kupotech.com
 */
import { list2map } from '../../../utils/tools';
import { getConvertBaseConfig } from '../../../services/convert';
import { getUserInfo, getCurrenciesMap } from '../../../services/basic';

const basicStates = [
  {
    name: 'currenciesMap',
    defaultValue: {},
    fallbackFetchFn: async () => {
      const {
        data: { kucoin },
      } = await getCurrenciesMap();
      return {
        currenciesMap: kucoin,
      };
    },
  },
  {
    name: 'user',
    fallbackFetchFn: async () => {
      try {
        const { data } = await getUserInfo();
        if (data) {
          data.isSub = data.type === 3;
        }
        return { user: data || null };
      } catch (e) {
        return { user: null };
      }
    },
  },
  {
    name: 'baseConvertConfig',
    fallbackFetchFn: async () => {
      try {
        const { data } = await getConvertBaseConfig();
        return { baseConvertConfig: data };
      } catch (e) {
        return { baseConvertConfig: { downtime: false } };
      }
    },
  },
];

export const basicStatesDefaultValues = list2map(basicStates, 'name', (v) => v.defaultValue);
export default basicStates;
