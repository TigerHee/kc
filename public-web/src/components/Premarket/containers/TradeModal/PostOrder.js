/**
 * Owner: solar.xia@kupotech.com
 */
import * as tma from '@kc/telegram-biz-sdk';
import { Alert, Col, Divider, useSnackbar } from '@kux/mui';
import clsx from 'clsx';
import isNil from 'lodash/isNil';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import TaxInfoCollectDialog, {
  preloadTaxInfoCollectDialog,
} from 'src/components/TaxInfoCollectDialog';
import { useSelector } from 'src/hooks/useSelector';
import siteCfg from 'src/utils/siteConfig';
import { _t } from 'tools/i18n';
import { Form, Input, Modal } from '../../components';
import withNumberInput from '../../hocs/withNumberInput';
import { add, getDecimalPlace, getMin, multiply } from '../../util';
import PassWordModal from './Password';
import {
  AlertContainer,
  AlertForTransaction,
  AlertUnreasonableTip,
  TransferButton,
  validInput,
} from './shared';
import SpiltSwitch from './SpiltSwitch';
import { StyledPostOrder, StyledRow } from './styledComponent';
import ToolTipContent from './ToolTipContent';

const { FormItem, useForm } = Form;
const InputNumber = withNumberInput(Input);
// 挂单第一个弹窗
const PostOrderProcess1 = forwardRef(({ open, onClose, onConfirm }, ref) => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { price, size } = useSelector((state) => state.aptp.createOrderParams, shallowEqual);
  const { side } = useSelector((state) => state.aptp.modalInfo, shallowEqual);
  const deliveryCurrency = useSelector((state) => state.aptp.deliveryCurrency);
  const {
    offerCurrency,
    pledgeRate,
    buyMakerFeeRate, // 买方maker费率
    sellMakerFeeRate, // 卖方maker费率
    priceIncrement,
    sizeIncrement,
    buyMakerMaxFee = Infinity, // 买方maker最大手续费
    sellMakerMaxFee = Infinity, // 卖方maker最大手续费
    tradeStartAt,
  } = useSelector((state) => state.aptp.deliveryCurrencyInfo, shallowEqual);
  const { availableBalance } = useSelector((state) => state.aptp.user, shallowEqual);
  const taxInfo = useSelector((state) => state.aptp.taxInfo, shallowEqual);
  const supportBreakContractTime = useSelector((state) => state.aptp.supportBreakContractTime);

  const { taxEnable, taxRate, maxTax } = taxInfo || {};
  const isBuy = side === 'buy';
  const title = _t(isBuy ? 'nnAhqTzRAq7ipP9ge3C1RV' : 'vHx15khwdoX8yoMrTTJw9A', {
    currency: deliveryCurrency,
  });
  const orderTotal = useMemo(() => {
    return multiply(price, size);
  }, [price, size]);

  const pledgeTotal = useMemo(() => {
    return multiply(orderTotal, pledgeRate, 0.01);
  }, [orderTotal, pledgeRate]);

  const feeTotal = useMemo(() => {
    const fee = multiply(orderTotal, side === 'buy' ? buyMakerFeeRate : sellMakerFeeRate, 0.01);
    return getMin(fee, side === 'buy' ? +buyMakerMaxFee : +sellMakerMaxFee);
  }, [orderTotal, buyMakerMaxFee, sellMakerMaxFee, buyMakerFeeRate, sellMakerFeeRate, side]);

  // 税费
  const taxFee = useMemo(() => {
    const _taxFee = multiply(orderTotal, taxRate);
    if (!isNil(maxTax)) {
      return getMin(_taxFee, maxTax);
    }
    return _taxFee;
  }, [orderTotal, taxRate, maxTax]);

  const total = useMemo(() => {
    if (isBuy && !taxEnable) {
      return add(feeTotal, orderTotal);
    }
    if (isBuy && taxEnable) {
      return add(add(feeTotal, orderTotal), taxFee);
    } else {
      return pledgeTotal;
    }
  }, [isBuy, feeTotal, orderTotal, pledgeTotal, taxFee, taxEnable]);

  const validStatus = useMemo(() => {
    return validInput(side, total, availableBalance);
  }, [side, total, availableBalance]);

  useImperativeHandle(ref, () => ({
    resetFields: () => {
      form.resetFields();
    },
  }));

  function handleClose() {
    form.resetFields();
    dispatch({
      type: 'aptp/changeCreateOrderParams',
      payload: {},
    }).then(() => {
      onClose();
    });
  }

  function handleConfirm() {
    form.validateFields().then(() => {
      return onConfirm();
    });
  }

  function handleChangeSide() {
    dispatch({
      type: 'aptp/openPostModal',
      payload: {
        side: side === 'buy' ? 'sell' : 'buy',
      },
    });
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      onConfirm={handleConfirm}
      disabledConfirm={validStatus !== 'success'}
      drawerHeightSize="md"
    >
      <StyledPostOrder>
        <div className="side-select">
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className={clsx('side-buy', 'side-select-item', { active: side === 'buy' })}
            onClick={side === 'buy' ? undefined : handleChangeSide}
          >
            {_t('buy')}
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className={clsx('side-sell', 'side-select-item', { active: side === 'sell' })}
            onClick={side === 'sell' ? undefined : handleChangeSide}
          >
            {_t('sell')}
          </div>
        </div>
        <Form
          form={form}
          onValuesChange={(_, values) => {
            dispatch({
              type: 'aptp/changeCreateOrderParams',
              payload: values,
            });
          }}
        >
          <FormItem
            rules={[
              {
                validator: (rule, _, callback) => {
                  const value = form.getFieldValue('price');
                  if (value === '') {
                    callback(_t('form.required'));
                  } else if (value === '0') {
                    callback(_t('497Mjj7mhZgVbUbv2Hwavq'));
                  } else if (getDecimalPlace(value) > getDecimalPlace(priceIncrement)) {
                    callback(
                      _t('p7Zh4Pev4fwuQt8fCrbKer', {
                        priceIncrement,
                      }),
                    );
                  } else {
                    callback();
                  }
                },
              },
            ]}
            name="price"
            label={_t('qidVjpf13KYd5L8hNg1dHT')}
            validateTrigger={['onInput']}
          >
            <InputNumber
              placeholder={_t('itWqpbHQ1SfuEyhLC8iWQS')}
              className="price"
              label={_t('qidVjpf13KYd5L8hNg1dHT')}
              addonAfter={<span>{offerCurrency}</span>}
            />
          </FormItem>
          <FormItem
            rules={[
              {
                validator: (rule, _, callback) => {
                  const value = form.getFieldValue('size');
                  if (value === '') {
                    callback(_t('form.required'));
                  } else if (value === '0') {
                    callback(_t('vg4KhP9jrShvi5mjQUPJdK'));
                  } else if (getDecimalPlace(value) > getDecimalPlace(sizeIncrement)) {
                    callback(
                      _t('p7Zh4Pev4fwuQt8fCrbKer', {
                        priceIncrement: sizeIncrement,
                      }),
                    );
                  } else {
                    callback();
                  }
                },
              },
            ]}
            name="size"
            validateTrigger={['onInput']}
            label={_t('c1x1JCeu37sm1sgJ9ePPSA')}
          >
            <InputNumber
              placeholder={_t('1mDf2TmQsjAKqqUoKnVe4G')}
              className="size"
              label={_t('c1x1JCeu37sm1sgJ9ePPSA')}
              addonAfter={<span>{deliveryCurrency}</span>}
            />
          </FormItem>
        </Form>
        <StyledRow>
          <Col span={12}>{_t('rQQoTYF6DVRd79Uf3J2Bge')}</Col>
          <Col span={12}>
            <span className="amount">{orderTotal}</span>
            <span className="currency-type">{offerCurrency}</span>
          </Col>
        </StyledRow>
        {!isBuy && (
          <StyledRow>
            <Col span={12}>{_t('o9A3ECqaVXAgp4BeQRHXfj')}</Col>
            <Col span={12}>
              <span className="amount">{pledgeTotal}</span>
              <span className="currency-type">{offerCurrency}</span>
            </Col>
          </StyledRow>
        )}
        <Divider />
        {isBuy && (
          <>
            <StyledRow>
              <Col span={12}>{_t('2m1a87XbefEz8qVuMShNmQ')}</Col>
              <Col span={12}>
                <span className="amount">{feeTotal}</span>
                <span className="currency-type ">{offerCurrency}</span>
              </Col>
            </StyledRow>
            {taxEnable && (
              <StyledRow>
                <Col span={12} className="taxLabel">
                  {_t('iuDRyxRoWafb3KvU3KNdmj')}
                  <ToolTipContent />
                </Col>
                <Col span={12}>
                  <span className="amount">{taxFee}</span>
                  <span className="currency-type">{offerCurrency}</span>
                </Col>
              </StyledRow>
            )}
          </>
        )}

        <StyledRow>
          <Col span={12}>{_t('54GHmnw9uSsw8m7dyN5dQi')}</Col>
          <Col span={12}>
            <span className="amount total">{total}</span>
            <span className="currency-type ">{offerCurrency}</span>
          </Col>
        </StyledRow>
        <SpiltSwitch totalFuns={orderTotal} price={price} />
        <Divider />
        <StyledRow mt={4} noMb={true}>
          <Col span={12}>{_t('u7wMqhAvb4Bynjz7e3nK1h')}</Col>
          <Col span={12}>
            <span className="amount">{availableBalance}</span>
            <span className="currency-type">{offerCurrency}</span>
            <TransferButton offerCurrency={offerCurrency} />
          </Col>
        </StyledRow>
        <AlertContainer>
          <AlertUnreasonableTip price={form.getFieldValue('price')} />
          <AlertForTransaction
            pledgeTotal={pledgeTotal}
            validStatus={validStatus}
            size={form.getFieldValue('size')}
            price={form.getFieldValue('price')}
            fee={feeTotal}
            taxFee={taxFee}
          />
          {tradeStartAt > supportBreakContractTime && (
            <Alert showIcon type="warning" title={_t('3ee8944760a64000ad0a')} />
          )}
        </AlertContainer>
      </StyledPostOrder>
    </Modal>
  );
});

// 挂单内容
export default function PostOrder({ open, onClose }) {
  const side = useSelector((state) => state.aptp.modalInfo.side);
  const isBuy = side === 'buy';
  const [process2Open, setProcess2Open] = useState(false);
  const [panOpen, setPanOpen] = useState(false);
  const offerCurrency = useSelector((state) => state.aptp.deliveryCurrencyInfo?.offerCurrency);
  const deliveryCurrency = useSelector((state) => state.aptp.deliveryCurrency);
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const postOrderRef = useRef();
  const process1Open = useMemo(() => {
    return open && !process2Open && !panOpen;
  }, [open, process2Open, panOpen]);

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
          opType: 'DEAL',
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
      <PostOrderProcess1
        ref={postOrderRef}
        open={process1Open}
        onClose={() => {
          onClose();
        }}
        onConfirm={() => {
          return dispatch({
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
            type: 'aptp/createGreyMarketOrder',
            payload: {
              remark: tma?.bridge?.isTMA() ? 'miniApp' : undefined,
            },
          }).then((res) => {
            if (res?.success) {
              postOrderRef.current?.resetFields();
              onClose();
              setProcess2Open(false);
              message.success(isBuy ? _t('3ovchg96KFSss7uzkuSu4H') : _t('c9VuPubH26o8T3fLhc4LNq'));
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
