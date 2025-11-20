/**
 * Owner: willen@kupotech.com
 */
import { _t } from 'tools/i18n';

// 拼接notification的描述信息
const formatDescription = (tradeType, side, currentCoin, currentPair, categories) => {
  let coinName = '';
  let pairName = '';
  if (categories) {
    coinName = categories[currentCoin] ? categories[currentCoin].currencyName : '';
    pairName = categories[currentPair] ? categories[currentPair].currencyName : '';
  }
  return `${tradeType} ${_t(side)} ${coinName}/${pairName}`;
};

export default formatDescription;
