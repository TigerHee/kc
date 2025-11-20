/**
 * Owner: melon@kupotech.com
 */
/**
 *
 * 获取币种对应信息
 * 有的币种currency 和 实际的展示币种名称不一样 比如 LOKI 展示应该是OXEN
 */

import { get } from 'lodash';
import { useSelector } from 'hooks';


const useKuCurrency = () => {
  const categories = useSelector((state) => state.categories, 'ignore'); // 币种数据
  const coinDict = categories || {}; // 币种详情对象

  /**
   * 获取币种详情
   * @param {*} coin 币种code 默认是 BTC
   * @returns 币种详情
   */
  const getKuCoin = (coin = 'BTC') => {
    return coinDict[coin] || {};
  };

  /**
   * 根据key获取对应的币种的数据
   * @param {*} coin 币种code 默认是 null
   * @param {*} key 默认是currencyName-币种展示名称
   * @param {*} defaultVal
   * @returns
   */
  const getKuCoinValByKey = (coin = null, key = 'currencyName', defaultVal = '') => {
    const coinObj = getKuCoin(coin);
    const value = get(coinObj || {}, key, defaultVal || '');
    return value;
  };

  return {
    getKuCoin,
    getKuCoinValByKey,
  };
};

export default useKuCurrency;
