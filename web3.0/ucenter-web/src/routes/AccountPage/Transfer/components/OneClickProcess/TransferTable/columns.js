/**
 * Owner: jacky@kupotech.com
 */

import { useResponsive } from '@kux/mui';
import { useSelector } from 'react-redux';
import { showDatetime } from 'src/helper';
import { _t } from 'src/tools/i18n';
import { GreenText, RedText } from '../components/CommonTable';

export const formatTs = (timestamp) => {
  if (!timestamp) return '--';
  // 截取前13位
  let ts = String(timestamp).slice(0, 13);
  const format = 'DD/MM/YYYY HH:mm:ss';
  return showDatetime(ts, format);
};

const getDividedSymbol = (tradePair) => {
  return tradePair.includes('-') ? '-' : '/';
};

/**
 * 转为交易对格式
 * SOL-USDT => SOL/USDT
 */
export const formatTradingPair = (tradePair) => {
  if (!tradePair) return '';
  const symbol = getDividedSymbol(tradePair);
  const [base, quote] = tradePair.split(symbol);
  return `${base} / ${quote}`;
};

/**
 * 获取交易对的 from - to
 * SOL-USDT => { from: 'USDT', to: 'SOL' }
 */
export const getPairInfo = (tradePair) => {
  if (!tradePair) return { to: '', from: '' };
  const symbol = getDividedSymbol(tradePair);
  const [to = '', from = ''] = tradePair.split(symbol);
  return { to, from };
};

/**
 * 根据 settleCurrency 获取结算货币
 * @param {string} settleCurrency - 结算货币
 */
export const getSettleCurrency = (settleCurrency) => {
  return settleCurrency === 'XBT' ? 'BTC' : settleCurrency;
};

export const getSideWrapper = (text) => {
  if (!text) return RedText;
  return text.toLocaleLowerCase() === 'buy' ? GreenText : RedText;
};

export const stopMark = {
  entry: '≥',
  loss: '≤',
  e_oco: '-|≥',
  l_oco: '-|≤',
  e_s_o: '-|≥',
  l_s_o: '-|≤',
};

export const getNumberWrapper = (number) => {
  let Wrapper = ({ children }) => <span>{children}</span>;
  try {
    const num = Number(number);
    if (num > 0) Wrapper = GreenText;
    if (num < 0) Wrapper = RedText;
    return Wrapper;
  } catch (error) {
    return Wrapper;
  }
};

export const TimeBox = ({ timestamp }) => {
  const rv = useResponsive();
  const isTablet = rv?.sm && !rv.lg;
  return <>{formatTs(timestamp, isTablet)}</>;
};

const SETTLE_CONTRACT = 'FFICSX';
const SUSTAIN_CONTRACT = 'FFWCSX';
/**
 * 获取合约名称
 */
export const SymbolName = ({ symbol }) => {
  const map = useSelector((state) => state.userTransfer?.symbolsMap);
  const record = map?.[symbol];
  if (!symbol) return '--';
  if (!record) return symbol;

  const { baseCurrency, type, quoteCurrency } = record;
  const base = baseCurrency === 'XBT' ? 'BTC' : baseCurrency;

  let typeText = '';
  if (type === SETTLE_CONTRACT) typeText = _t('symbol.settle');
  else if (type === SUSTAIN_CONTRACT) typeText = _t('symbol.eternity');

  if (!typeText) return symbol;
  return `${base}/${quoteCurrency} ${typeText}`;
};

export const tradeTypeName = (value) => {
  const map = {
    MARGIN_TRADE: _t('c027d3f0c79c4000af82'),
    MARGIN_ISOLATED_TRADE: _t('e4c5a23ba6624000a862'),
  };

  return map[value] || value;
};

export const SideText = ({ text }) => {
  if (!text) return '--';
  let result = text.toLocaleLowerCase() === 'buy' ? 'buy' : 'sell';
  const Wrapper = getSideWrapper(result);
  return <Wrapper>{_t(result)}</Wrapper>;
};
