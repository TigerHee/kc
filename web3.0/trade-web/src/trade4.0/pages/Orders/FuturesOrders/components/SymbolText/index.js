/**
 * Owner: clyne@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch } from 'dva';
import moment from 'moment';
import { SETTLE_CONTRACT, SUSTAIN_CONTRACT } from '@/meta/futures';
import { _t } from 'utils/lang';
import { formatCurrency } from '@/utils/futures';
import { RightOutlined } from '@kux/icons';
import styles from './style.less';
import { useFuturesSymbols } from 'src/trade4.0/hooks/common/useSymbol';
import { FUTURES } from 'src/trade4.0/meta/const';

const symbolToText = (contract, symbol, isHTML, isH1, trialFundCell) => {
  return newSymbolToText({ contract, symbol, isHTML, isH1, trialFundCell });
};
/**
 * symbol文案显示
 * @param {object} options 参数
 * @param {object} options.contract 合约对象
 * @param {string} options.symbol 交易对
 * @param {boolean} options.isHTML 是否html
 * @param {boolean} options.isH1
 * @param {boolean} options.trialFundCell 体验金标签
 * @param {boolean} options.trialFundDir 体验金标签方向，column换行像是，row一行现实
 * @returns
 */
const newSymbolToText = ({
  contract,
  symbol,
  isHTML,
  isH1,
  trialFundCell,
  isWap = false,
  lev = '',
  // 下面2个参数只作用于新的样式
  isNewDisplay = false,
}) => {
  if (!contract) {
    return symbol;
  }

  const { baseCurrency, type, settleDate, quoteCurrency } = contract;
  const trialFundText = trialFundCell || '';
  let typeText = '';
  let settleText = '';
  const base = formatCurrency(baseCurrency); // 基准币种

  if (type === SETTLE_CONTRACT) {
    typeText = _t('symbol.settle');
    settleText = moment.utc(settleDate).utcOffset(8).format('MMDD');
    if (isHTML) {
      // currency 需要 color body
      return (
        <div className={`${styles.symbolBox} ${isWap ? styles.isWap : ''}`}>
          <div
            className={`${styles.symbolBox} ${styles.dirbox}  ${isWap ? styles.isWap : ''}`}
            dir="ltr"
          >
            <div className={`${styles.nowap} symbol-base`}>{`${base} ${typeText}`}</div>
            <div
              className={`currencyText ${styles.margin4} ${styles.currencyText} ${
                isH1 ? styles.importColor : ''
              }`}
            >
              {settleText}
            </div>
          </div>
          {isNewDisplay ? <RightOutlined className="iconRtl" /> : <></>}
          {lev}
        </div>
      );
    }
  }

  if (type === SUSTAIN_CONTRACT) {
    if (isHTML) {
      const OldDisplay = (
        <>
          <div className={styles.nowap}>{`${base} ${_t('contract.detail.perpetual')}`}</div>
          <div className={`currencyText ${styles.currencyText} ${isH1 ? styles.importColor : ''}`}>
            {`/${quoteCurrency}`}
          </div>
        </>
      );

      const NewDisplay = (
        <>
          <div className={`${styles.nowap} symbol-base`}>{`${base}/${quoteCurrency}`}</div>
          <div
            className={`currencyText ${styles.margin4} ${styles.currencyText} ${
              isH1 ? styles.importColor : ''
            }`}
          >
            {`${_t('contract.detail.perpetual')}`}
          </div>
        </>
      );
      // currency 需要 color body
      return (
        <div className={`${styles.symbolBox} ${isWap ? styles.isWap : ''}`}>
          <div
            className={`${styles.symbolBox} ${styles.dirbox}  ${isWap ? styles.isWap : ''}`}
            dir="ltr"
          >
            {!isNewDisplay ? OldDisplay : NewDisplay}
          </div>
          {isNewDisplay ? <RightOutlined className="iconRtl" /> : <></>}
          {lev}
          {trialFundText}
        </div>
      );
    } else {
      typeText = !isNewDisplay
        ? `${_t('contract.detail.perpetual')}/${quoteCurrency}`
        : `${quoteCurrency}/${_t('contract.detail.perpetual')}`;
    }
  }

  if (!typeText) {
    return symbol;
  }
  const returnText = `${base} ${typeText} ${settleText} ${trialFundText}`;

  return returnText;
};

const SymbolText = ({
  contract,
  symbol,
  className = '',
  style = null,
  isH1 = false,
  trialFundCell,
  lev,
  isWap,
  isNewDisplay,
  hasLink,
  onSymbolClick: onClickFn = () => {},
}) => {
  const dictAll = useFuturesSymbols();
  const text = newSymbolToText({
    contract: contract || dictAll[symbol],
    symbol,
    isHTML: true,
    isH1,
    trialFundCell,
    lev,
    isWap,
    isNewDisplay,
  });
  const dispatch = useDispatch();

  const symbolLinkClass = hasLink ? 'symbol-link' : '';
  const onClick = useCallback(() => {
    if (hasLink) {
      onClickFn();
      dispatch({
        type: '$tradeKline/routeToSymbol',
        payload: { symbol, toTradeType: FUTURES },
      });
    }
  }, [dispatch, hasLink, onClickFn, symbol]);
  return (
    <>
      {isH1 && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <h1
          style={style}
          onClick={onClick}
          className={`${className} ${styles.h1Title} ${symbolLinkClass}`}
        >
          {text}
        </h1>
      )}
      {!isH1 && (
        <div style={style} onClick={onClick} className={`${className} ${symbolLinkClass}`}>
          {text}
        </div>
      )}
    </>
  );
};

SymbolText.symbolToText = symbolToText;

SymbolText.newSymbolToText = newSymbolToText;

export default SymbolText;
