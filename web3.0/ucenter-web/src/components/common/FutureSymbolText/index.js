/**
 * Owner: willen@kupotech.com
 */
import moment from 'moment';
import { _t } from 'tools/i18n';

const SETTLE_CONTRACT = 'FFICSX';
const SUSTAIN_CONTRACT = 'FFWCSX';

const symbolToText = (contract, symbol, isHTML) => {
  if (!contract) {
    return symbol;
  }
  const { baseCurrency, type, settleDate, quoteCurrency } = contract;
  let typeText = '';
  let settleText = '';

  if (type === SETTLE_CONTRACT) {
    typeText = _t('symbol.settle');
    settleText = moment.utc(settleDate).utcOffset(8).format('MMDD');
  }

  const base = baseCurrency === 'XBT' ? 'BTC' : baseCurrency;
  const settleUnit = quoteCurrency;

  if (type === SUSTAIN_CONTRACT) {
    // 渲染增加 span 标签
    if (isHTML) {
      return (
        <>
          <span>{base}</span>
          <span>{_t('symbol.eternity')}</span>
          <span>{`/${settleUnit}`}</span>
        </>
      );
    }
    typeText = `${_t('symbol.eternity')}/${settleUnit}`;
  }

  if (!typeText) {
    return symbol;
  }
  const returnText = `${base} ${typeText} ${settleText}`;

  return returnText;
};

const SymbolText = ({ contract, symbol, className = '', isHTML = false }) => {
  const text = symbolToText(contract, symbol, isHTML);

  return <div className={className}>{text}</div>;
};

export default SymbolText;
