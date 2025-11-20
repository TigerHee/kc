/**
 * Owner: solar.xia@kupotech.com
 */
import * as tma from '@kc/telegram-biz-sdk';
import { Alert, Col, Divider, useSnackbar } from '@kux/mui';
import isNil from 'lodash/isNil';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import TaxInfoCollectDialog, {
  preloadTaxInfoCollectDialog,
} from 'src/components/TaxInfoCollectDialog';
import { useSelector } from 'src/hooks/useSelector';
import siteCfg from 'src/utils/siteConfig';
import { _t } from 'tools/i18n';
import separateNumber from 'utils/separateNumber';
import { Modal } from '../../components';
import { add, getMin, multiply } from '../../util';
import PassWordModal from './Password';
import {
  AlertContainer,
  AlertForTransaction,
  AlertUnreasonableTip,
  TransferButton,
  validInput,
} from './shared';
import { StyledRow, StyledTakeOrder } from './styledComponent';
import ToolTipContent from './ToolTipContent';

// 吃单第一个弹窗
function TakeOrderProcess1({ open, onClose, onConfirm }) {
  const { side, id } = useSelector((state) => state.aptp.modalInfo, shallowEqual);
  const deliveryCurrency = useSelector((state) => state.aptp.deliveryCurrency);
  const { size, price, funds } =
    useSelector((state) => state.aptp.records, shallowEqual).find((item) => item.id === id) || {};
  const { availableBalance } = useSelector((state) => state.aptp.user, shallowEqual);
  const {
    offerCurrency,
    buyTakerFeeRate, // 买方taker费率
    sellTakerFeeRate, // 卖方taker费率
    pledgeRate,
    buyTakerMaxFee = Infinity, // 买方taker最大手续费
    sellTakerMaxFee = Infinity, // 卖方taker最大手续费
    tradeStartAt,
  } = useSelector((state) => state.aptp.deliveryCurrencyInfo, shallowEqual);
  const taxInfo = useSelector((state) => state.aptp.taxInfo, shallowEqual);
  const supportBreakContractTime = useSelector((state) => state.aptp.supportBreakContractTime);

  const { taxEnable, taxRate, maxTax } = taxInfo || {};
  const isBuy = side === 'buy';
  const title = _t(isBuy ? 'nnAhqTzRAq7ipP9ge3C1RV' : 'vHx15khwdoX8yoMrTTJw9A', {
    currency: deliveryCurrency,
  });
  const feeTotal = useMemo(() => {
    const fee = multiply(funds, side === 'buy' ? buyTakerFeeRate : sellTakerFeeRate, 0.01);
    return getMin(fee, side === 'buy' ? +buyTakerMaxFee : +sellTakerMaxFee);
  }, [funds, buyTakerFeeRate, sellTakerFeeRate, side, buyTakerMaxFee, sellTakerMaxFee]);

  // 税费
  const taxFee = useMemo(() => {
    const _taxFee = multiply(funds, taxRate);
    if (!isNil(maxTax)) {
      return getMin(_taxFee, maxTax);
    }
    return _taxFee;
  }, [funds, taxRate, maxTax]);

  const pledgeTotal = useMemo(() => {
    return multiply(funds, pledgeRate, 0.01);
  }, [funds, pledgeRate]);

  const totalPayment = useMemo(() => {
    if (isBuy && !taxEnable) {
      return add(feeTotal, funds);
    }
    if (isBuy && taxEnable) {
      return add(add(feeTotal, funds), taxFee);
    } else {
      return pledgeTotal;
    }
  }, [isBuy, feeTotal, funds, pledgeTotal, taxFee, taxEnable]);

  const validStatus = useMemo(() => {
    return validInput(side, totalPayment, availableBalance);
  }, [side, totalPayment, availableBalance]);

  function handleConfirm() {
    if (validStatus !== 'success') return;
    onConfirm();
  }
  function handleCancel() {
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={title}
      onConfirm={handleConfirm}
      disabledConfirm={validStatus !== 'success'}
      drawerHeightSize="md"
    >
      <StyledTakeOrder>
        <header>
          <h2>{separateNumber(size)}</h2>
          <small>{deliveryCurrency}</small>
        </header>
        <main>
          <StyledRow>
            <Col span={12}>{_t('qidVjpf13KYd5L8hNg1dHT')}</Col>
            <Col span={12}>
              <span className="amount">{price}</span>
              <span className="currency-type">{offerCurrency}</span>
            </Col>
          </StyledRow>
          <Divider />
          <StyledRow>
            <Col span={12}>{_t('rQQoTYF6DVRd79Uf3J2Bge')}</Col>
            <Col span={12}>
              <span className="amount">{funds}</span>
              <span className="currency-type">{offerCurrency}</span>
            </Col>
            {isBuy && (
              <>
                <Col span={12}>{_t('2m1a87XbefEz8qVuMShNmQ')}</Col>
                <Col span={12}>
                  <span className="amount">{feeTotal}</span>
                  <span className="currency-type">{offerCurrency}</span>
                </Col>
                {taxEnable && (
                  <>
                    <Col span={12} className="taxLabel">
                      {_t('iuDRyxRoWafb3KvU3KNdmj')}
                      <ToolTipContent />
                    </Col>
                    <Col span={12}>
                      <span className="amount">{taxFee}</span>
                      <span className="currency-type">{offerCurrency}</span>
                    </Col>
                  </>
                )}
              </>
            )}
            {!isBuy && (
              <>
                <Col span={12}>{_t('o9A3ECqaVXAgp4BeQRHXfj')}</Col>
                <Col span={12}>
                  <span className="amount">{pledgeTotal}</span>
                  <span className="currency-type">{offerCurrency}</span>
                </Col>
              </>
            )}

            <Col span={12}>{_t('54GHmnw9uSsw8m7dyN5dQi')}</Col>
            <Col span={12}>
              <span className="amount total">{totalPayment}</span>
              <span className="currency-type">{offerCurrency}</span>
            </Col>
          </StyledRow>
          <Divider />
          <StyledRow mt={4} noMb={true}>
            <Col span={12}>{_t('u7wMqhAvb4Bynjz7e3nK1h')}</Col>
            <Col span={12}>
              <span className="amount">{availableBalance}</span>
              <span className="currency-type">{offerCurrency}</span>
              <TransferButton offerCurrency={offerCurrency} />
            </Col>
          </StyledRow>
        </main>

        <AlertContainer>
          <AlertUnreasonableTip price={price} />
          <AlertForTransaction
            pledgeTotal={pledgeTotal}
            size={size}
            price={price}
            validStatus={validStatus}
            fee={feeTotal}
            taxFee={taxFee}
          />
          {tradeStartAt > supportBreakContractTime && (
            <Alert showIcon type="warning" title={_t('3ee8944760a64000ad0a')} />
          )}
        </AlertContainer>
      </StyledTakeOrder>
    </Modal>
  );
}

// 吃单
export default function TakeOrder({ open, onClose }) {
  const [process2Open, setProcess2Open] = useState(false);
  const [panOpen, setPanOpen] = useState(false);
  const side = useSelector((state) => state.aptp.modalInfo.side);
  const isBuy = side === 'buy';
  const dispatch = useDispatch();
  const process1Open = useMemo(() => {
    return open && !process2Open && !panOpen;
  }, [open, process2Open, panOpen]);
  const { message } = useSnackbar();
  const offerCurrency = useSelector((state) => state.aptp?.deliveryCurrencyInfo?.offerCurrency);
  const deliveryCurrency = useSelector((state) => state.aptp.deliveryCurrency);

  useEffect(() => {
    if (open) {
      dispatch({
        type: 'aptp/queryUserSingleBlance',
        payload: {
          accountType: 'TRADE',
          currency: offerCurrency,
          tag: 'DEFAULT',
        },
      });
    }
  }, [dispatch, offerCurrency, open]);

  useEffect(() => {
    if (open) {
      dispatch({
        type: 'aptp/pullTaxInfo',
        payload: {
          shortName: deliveryCurrency,
          opType: 'TAKE',
          tradeSide: side?.toUpperCase(),
        },
      });
      dispatch({
        type: 'aptp/pullTaxTips',
      });
      // 加载弹窗
      preloadTaxInfoCollectDialog();
    }
  }, [dispatch, open, deliveryCurrency, side]);
  return (
    <>
      <TakeOrderProcess1
        open={process1Open}
        onClose={() => {
          onClose();
        }}
        onConfirm={() => {
          dispatch({
            type: 'aptp/getPasswordInfo',
          }).then((isSuccess) => {
            if (isSuccess) {
              setProcess2Open(true);
            } else {
              const { KUCOIN_HOST } = siteCfg;
              dispatch({
                type: 'aptp/changeConfirmVisible',
                payload: {
                  open: true,
                  content: _t('b8xgJQQCRJU2diJsZ4aE5A'),
                  title: _t('hzuTMrM2aSsf8oYsdBf6ri'),
                  buttonText: _t('5KYahEazb9tqqzSe5z7V6m'),
                  buttonAction: (next) => {
                    window.open(`${KUCOIN_HOST}/account/security/protect`);
                  },
                  hideCancel: true,
                },
              });
            }
          });
        }}
      />
      <PassWordModal
        open={process2Open}
        panOpen={panOpen}
        onClose={() => {
          setProcess2Open(false);
        }}
        onConfirm={() => {
          // 成功
          return dispatch({
            type: 'aptp/takeGreyMarketOrder',
            payload: {
              remark: tma?.bridge?.isTMA() ? 'miniApp' : undefined,
            },
          }).then((res) => {
            if (res?.success) {
              setProcess2Open(false);
              onClose();
              message.success(isBuy ? _t('w4SfFgSNrxrpjqmCqpLYVF') : _t('5E9b4qTUAwAscxQo3qxrgQ'));
            } else {
              if (res?.code === '600000') {
                setPanOpen(true);
              } else {
                dispatch({
                  type: 'app/setToast',
                  payload: { type: 'error', message: res?.msg },
                });
              }
            }
          });
        }}
      />
      <TaxInfoCollectDialog
        source="premarketing"
        open={panOpen}
        onCancel={() => setPanOpen(false)}
      />
    </>
  );
}
