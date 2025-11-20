/**
 * Owner: solar.xia@kupotech.com
 */
// import { Alert } from '@kux/mui';
import JsBridge from '@knb/native-bridge';
import { useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import transfer from 'static/aptp/transfer.svg';
import { _t, _tHTML } from 'tools/i18n';
import { useProcessPercentage } from '../../hooks';
import { greeterThan, lessThan, minus, multiply } from '../../util';
import { StyledAlert, StyledAlertContainer } from './styledComponent';

// 验证输入正规/验证余额不足
export function validInput(side, totalPayment, availableBalance) {
  if (side === 'buy') {
    if (totalPayment === '--') return 'err-input';
    if (parseFloat(totalPayment) > parseFloat(availableBalance)) return 'err-noSufficient';
  } else {
    if (totalPayment === '--') return 'err-input';
    if (parseFloat(totalPayment) > parseFloat(availableBalance)) return 'err-noSufficient';
  }
  return 'success';
}

export function TransferButton({ offerCurrency }) {
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();
  return (
    <img
      src={transfer}
      alt="transfer-icon"
      onClick={() => {
        if (isInApp) {
          JsBridge.open({
            type: 'jump',
            params: {
              url: `/account/transfer?coin=${offerCurrency}`,
            },
          });
        } else {
          dispatch({
            type: 'transfer/update',
            payload: {
              visible: true,
              initCurrency: offerCurrency,
              cusOnClose: () => {
                dispatch({
                  type: 'aptp/queryUserSingleBlance',
                  payload: {
                    accountType: 'TRADE',
                    currency: offerCurrency,
                    tag: 'DEFAULT',
                  },
                });
              },
            },
          });
        }
      }}
    />
  );
}

export function AlertForTransaction({ size, pledgeTotal, validStatus, price, fee, taxFee }) {
  const side = useSelector((state) => state.aptp.modalInfo.side);
  const deliveryCurrency = useSelector((state) => state.aptp.deliveryCurrency);
  const offerCurrency = useSelector((state) => state.aptp.deliveryCurrencyInfo.offerCurrency);
  const pledgeCompensateRatio = useSelector(
    (state) => state.aptp.deliveryCurrencyInfo.pledgeCompensateRatio,
  );
  const taxEnable = useSelector((state) => state.aptp.taxInfo.taxEnable);

  // 当卖方毁约时，买方实际到手赔偿
  const actualCompensation = useMemo(() => {
    return multiply(pledgeTotal, pledgeCompensateRatio, 0.01);
  }, [pledgeTotal, pledgeCompensateRatio]);

  const orderTotal = useMemo(() => {
    return multiply(price, size);
  }, [price, size]);

  // 当正常交割时，卖方实际到手收益
  const actualEarn = useMemo(() => {
    if (taxEnable) {
      return minus(minus(orderTotal, fee), taxFee);
    }
    return minus(orderTotal, fee);
  }, [orderTotal, fee, taxEnable, taxFee]);

  if (!size) {
    return null;
  }
  if (validStatus === 'err-noSufficient') {
    // 判断余额不足时的alert
    return <StyledAlert type="warning" description={_t('gEusa44YwmapmfviqD5K4g')} />;
  }
  if (validStatus !== 'success') return null;
  if (side === 'buy') {
    return (
      <StyledAlert
        type="warning"
        description={_t('arBQPcSvKkfJRNmrRK9ZHF', {
          size,
          deliveryCurrency,
          price: actualCompensation,
          offerCurrency,
        })}
      />
    );
  } else if (taxEnable) {
    return (
      <StyledAlert
        type="warning"
        description={_tHTML('tcCqeobBVCNehABsDWKDCu', {
          tax: taxFee,
          price: actualEarn,
          pledgeAmount: pledgeTotal,
          offerCurrency,
        })}
      />
    );
  } else {
    return (
      <StyledAlert
        type="warning"
        description={_tHTML('qtKzRQA8cVrLe4cyp3sBta', {
          price: actualEarn,
          pledgeAmount: pledgeTotal,
          offerCurrency,
        })}
      />
    );
  }
}

export function AlertUnreasonableTip({ price }) {
  const side = useSelector((state) => state.aptp.modalInfo.side);
  const { minSellPrice, maxBuyPrice } = useSelector((state) => state.aptp.priceInfo, shallowEqual);
  const percent = useProcessPercentage(50);
  const isBuy = side === 'buy';
  const tip = useMemo(() => {
    if (isBuy) {
      const limitPrice = multiply(2, minSellPrice);
      // 买入价格高于最低卖出价的5倍
      if (greeterThan(price, limitPrice)) {
        return _t('iq3RLVde3dMsM4VLgx2ZL9', {
          times: 2,
        });
      }
    } else {
      const limitPrice = multiply(0.5, maxBuyPrice);
      // 卖出价格低于当前最高买入價的20%
      if (lessThan(price, limitPrice)) {
        return _t('hkmDnSZZW8eor43GsZXhhj', {
          percent,
        });
      }
    }
    return false;
  }, [isBuy, minSellPrice, maxBuyPrice, percent, price]);
  return tip && <StyledAlert type="error" description={<span>{tip}</span>} />;
}

export function AlertContainer({ children }) {
  return <StyledAlertContainer>{children}</StyledAlertContainer>;
}
