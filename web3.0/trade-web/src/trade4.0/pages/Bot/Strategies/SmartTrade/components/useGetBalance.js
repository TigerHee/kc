/**
 * Owner: mike@kupotech.com
 */
import { useSelector, shallowEqual } from 'dva';
import { getBalanceByCurrency } from 'SmartTrade/config';

/**
 * @description: 获取持仓用户的资产
 * @return {*}
 */
export default ({ coins, useOtherCoins }) => {
  // 币币账户资产map
  const position = useSelector(
    (state) => state.user_assets.tradeMap,
    shallowEqual,
  );
  // 根据币种列表获取当前比比账户余额
  const { sumInUsdt, currentAccountList } = getBalanceByCurrency({
    useOtherCoins, // 是否使用多币种
    coins, // 当前的币种列表
    position, // 用户资产列表
  });
  return {
    sumInUsdt,
    currentAccountList,
  };
};
