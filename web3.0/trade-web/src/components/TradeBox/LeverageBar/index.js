/**
 * Owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import KcTooltip from 'components/KcTooltip';
import useMarginModel from 'utils/hooks/useMarginModel';
import { checkIsMargin, MarginSensors } from 'utils/hooks/useTradeTypes';
import useAvailableBalance from 'utils/hooks/useAvailableBalance';
import {
  BORROW_TYPE,
  TRADE_DIRECTION,
  isTriggerTrade,
} from 'pages/Trade3.0/components/TradeBox/TradeForm/const';
import { separateNumber } from 'helper';
import { _t, _tHTML } from 'utils/lang';
import styles from './styles/style.less';

import transferIcon from 'assets/transfer.svg';

const { Content } = KcTooltip;

export default React.memo(({ side }) => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);
  const { type } = useSelector(state => state.tradeForm);
  const categories = useSelector(state => state.categories);
  const { currentSymbol, tradeType } = useSelector(state => state.trade);

  const {
    borrowType,
    coinsConfig,
    userLeverage,
    borrowSizeMap,
  } = useMarginModel(['userLeverage', 'borrowSizeMap', 'borrowType', 'coinsConfig']);

  const isMargin = checkIsMargin(tradeType);
  const [base, quote] = currentSymbol.split('-');
  const currency = side === TRADE_DIRECTION.SELL ? base : quote;

  const { currencyName = '' } = categories[currency] || {};
  const { isDebitEnabled } = coinsConfig[currency] || {};
  const borrowSize = borrowSizeMap[currency] || 0;
  const [maxAvailableBalance, availableBalance] = useAvailableBalance(currency);

  const showTooltip = (
    isLogin &&
    isMargin &&
    !isTriggerTrade(type) &&
    borrowType === BORROW_TYPE.auto &&
    isDebitEnabled
  );

  const openMultiModal = useCallback(() => {
    MarginSensors(tradeType, ['marginTrading', 'setMulti']);

    dispatch({
      type: 'isolated/update',
      payload: {
        leverageVisible: true,
      },
    });
  }, [tradeType]);

  const openTransferModal = useCallback(() => {
    MarginSensors(tradeType, ['marginTrading', 'transfer']);

    dispatch({
      type: 'transfer/updateTransferConfig',
      payload: {
        visible: true,
        initCurrency: currency,
      },
    });
  }, [currency, tradeType]);

  return (
    <div className={styles.item}>
      {
        showTooltip ? (
          <KcTooltip
            interactive
            classes={{ tooltip: styles.maxTooltip }}
            title={
              <Content
                info={
                  <div className={styles.highlight}>
                    {_tHTML('isolated.trade.maxAvailable.detail', {
                      a: availableBalance,
                      b: currencyName,
                    })}
                    <br />
                    {_tHTML('isolated.trade.maxAvailable.detail2', {
                      a: borrowSize,
                      b: currencyName,
                    })}
                    <div className={styles.tooltipAction}>
                      <span onClick={openMultiModal}>{_t('multi.setting')}</span>
                    </div>
                  </div>
                }
                title={
                  <span>
                    {_tHTML('isolated.trade.maxAvailable', {
                      a: maxAvailableBalance,
                      b: currencyName,
                    })}
                  </span>
                }
              />
            }
          >
            <span className={styles.highlight}>
              {_tHTML('isolated.available.withMulti', { multi: userLeverage })}
            </span>
          </KcTooltip>
        ) : (<span>{_t('margin.avaliable')}：</span>)
      }
      <span className={styles.content}>
        {separateNumber(maxAvailableBalance)} {currencyName}
        <img
          src={transferIcon}
          onClick={openTransferModal}
          className={styles.transferIcon}
        />
      </span>
    </div>
  );
});
