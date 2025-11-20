/**
 * Owner: borden@kupotech.com
 */
import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  Fragment,
} from 'react';
import { connect, useSelector } from 'dva';
import { map, noop } from 'lodash';
import InputNumber from '@mui/InputNumber';
import Form from '@mui/Form';
import { Tabs } from '@mui/Tabs';
import { useSnackbar } from '@kux/mui/hooks';
import CoinPrecision from '@/components/CoinPrecision';
import {
  CrossPositonSocket,
  IsolatedPositonSocket,
} from '@/components/SocketSubscribe';

import { _t, _tHTML } from 'utils/lang';
import useMarginModel from '@/hooks/useMarginModel';

import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { multiplyFloor } from 'helper';
import { MODAL_TYPE } from './config';
import {
  TabWrapper,
  DialogWrapper,
  Tip,
  CoinSelectTabItem,
  CoinSelectWrapper,
  CoinSelectTabDesc,
  CoinIconPro,
  CoinIconWrapper,
  CanBorrowWrapper,
  CoinSelectTitle,
  BorrowBtn,
} from './style';
import FastButtonGroup from '@/components/FastButtonGroup';
import useSensorFunc from '@/hooks/useSensorFunc';

const { FormItem, useForm } = Form;
const { Tab } = Tabs;

// 数字格式正则
const numReg = /^[0-9]+(\.?[0-9]*)?$/;
// 订阅推送
const subscribeSocket = ({ visible, tradeType }) => {
  if (!visible) return null;
  if (tradeType === TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key) {
    return <IsolatedPositonSocket />;
  } else if (tradeType === TRADE_TYPES_CONFIG.MARGIN_TRADE.key) {
    return <CrossPositonSocket />;
  }
  return null;
};

/**
 * 借币 还币 弹窗
 */
const MarginModal = (props) => {
  const sensorFunc = useSensorFunc();

  // 是否需要校验size, 在切换借币/还币时，清空size，此时不需要校验
  const isNeedValidateSize = useRef(true);
  const [form] = useForm();
  const { message } = useSnackbar();
  const {
    dispatch,
    marginMap,
    categories,
    tradeType,
    currentSymbol,
    marginModalConfig,
    currentLang,
    ...rest
  } = props;
  const { position, borrowSizeMap, coinsConfig } = useMarginModel([
    'position',
    'borrowSizeMap',
    'coinsConfig',
  ]);
  const { open: visible, modalType: initModalType } = marginModalConfig;
  const { resetFields, setFieldsValue, validateFields } = form;
  const [base, quote] = currentSymbol.split('-');
  const { currencyName: baseName = '' } = categories[base] || {};
  const { currencyName: quoteName = '' } = categories[quote] || {};
  const { isDebitEnabled: baseIsDebitEnabled } = coinsConfig[base] || {};
  const { isDebitEnabled: quoteIsDebitEnabled } = coinsConfig[quote] || {};

  const [max, setMax] = useState(0);
  // modalType： 借币(0) or 还币(1)
  const [modalType, setModalType] = useState(0);
  const [currencyIndex, setCurrencyIndex] = useState(0);

  const modalConfig = useMemo(() => MODAL_TYPE[modalType], [modalType]);

  const confirmLoading = useSelector(
    (state) => state.loading.effects[modalConfig.postEffect(tradeType)],
  );
  const coins = useMemo(
    () =>
      [base, quote].filter((item) =>
        (item === base ? baseIsDebitEnabled : quoteIsDebitEnabled),
      ),
    [base, quote, baseIsDebitEnabled, quoteIsDebitEnabled],
  );
  const currentCurrency = coins[currencyIndex];
  const {
    borrowMaxAmount, // 币种借入最大金额范围
    borrowMinAmount, // 币种借入最小金额范围
    currencyLoanMinUnit, // 币种最小借出单位
  } = coinsConfig[currentCurrency] || {};
  const { availableBalance = 0, liability = 0 } =
    position[currentCurrency] || {};
  const borrowSize = borrowSizeMap[currentCurrency] || 0;
  const { currencyName: currentCurrencyName = '' } =
    categories[currentCurrency] || {};

  // 设置数量
  const setSize = useCallback((num) => {
    setFieldsValue({ size: num });
  }, []);

  // 重置modal
  const reset = useCallback(() => {
    resetFields();
    setModalType(initModalType === 0 ? 0 : 1);
    setCurrencyIndex(coins.length - 1);
  }, [initModalType, coins.length]);

  const resetSize = useCallback(() => {
    isNeedValidateSize.current = false;
    // 防止resetFields未触发validator, 所以isNeedValidateSize生命周期为500ms
    const time = setTimeout(() => {
      if (!isNeedValidateSize.current) {
        isNeedValidateSize.current = true;
      }
      clearTimeout(time);
    }, 500);
    resetFields(['size']);
  }, []);

  const fastClickAll = useCallback(
    (v) => {
      sensorFunc(['borrowRepayWindow', 'all']);

      setSize(v);
    },
    [sensorFunc],
  );

  const triggerSizeValidator = useCallback(
    (rule, value) => {
      if (!isNeedValidateSize.current) {
        isNeedValidateSize.current = true;
        return;
      }
      if (value === '') {
        return Promise.reject(_t('form.required'));
      }
      if (!numReg.test(value) || +value <= 0) {
        return Promise.reject(_t('trans.amount.num.err'));
      }
      value = +value;
      return modalConfig.validatorFunc({
        value,
        max: +max,
        borrowMaxAmount,
        borrowMinAmount,
        currencyLoanMinUnit,
      });
    },
    [max, modalType, borrowMaxAmount, borrowMinAmount, currencyLoanMinUnit],
  );

  const amountFastSet = useCallback(
    (multi) => {
      sensorFunc(['borrowRepayWindow', multi]);

      if (!max) setSize(0);
      const nextSize = multi === 1 ? max : multiplyFloor(max, multi);
      setSize(nextSize);
    },
    [max, currencyLoanMinUnit, sensorFunc],
  );

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'marginMeta/update',
      payload: {
        marginModalConfig: {
          ...marginModalConfig,
          open: false,
        },
      },
    });
  }, [marginModalConfig]);

  const handleSubmit = useCallback(() => {
    validateFields()
      .then((values) => {
        const {
          sentryFunc,
          postEffect,
          postCallback,
          defaultParams,
          getOkBtnGaFunc,
        } = modalConfig;
        // 埋点
        const okBtnGaFunc = getOkBtnGaFunc(sensorFunc) || noop;
        okBtnGaFunc();

        const payload = {
          symbol: currentSymbol,
          currency: currentCurrency,
          ...defaultParams,
          ...values,
        };
        const { size } = values;
        dispatch({
          payload,
          type: postEffect(tradeType),
        })
          .then((res) => {
            if (res && res.success) {
              postCallback(
                {
                  data: res.data,
                  size,
                  currentCurrencyName,
                  liability,
                },
                message,
              );
              handleCancel();
            }
          })
          .catch((error) => {
            if (
              error &&
              [
                210006, // 还款中
                210007, // 借款中
              ].some((v) => +error.code === v)
            ) {
              handleCancel();
            } else if (sentryFunc) {
              sentryFunc({ tradeType, payload, error });
            }
          })
          .finally(() => {
          });
      })
      .catch(() => {
      });
  }, [
    tradeType,
    currentSymbol,
    modalType,
    currentCurrency,
    currentCurrencyName,
    liability,
    handleCancel,
    sensorFunc,
  ]);

  // 打开弹框， 重置tab和活动币种
  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const okBtnExposeFunc =
        modalConfig?.getOkBtnExposeFunc(sensorFunc) || noop;
      okBtnExposeFunc();
    }
  }, [visible, modalType, sensorFunc]);

  // 切换tab或币种，重置数量
  useEffect(() => {
    resetSize();
  }, [modalType, currentCurrency]);

  useEffect(() => {
    const nextMax = modalConfig.getMax({ borrowSize, availableBalance });
    setMax(nextMax);
  }, [modalType, borrowSize, availableBalance]);

  const title = useMemo(
    () => (
      <TabWrapper>
        <Tabs
          variant="line"
          value={modalType}
          onChange={(e, v) => setModalType(v)}
        >
          {map(MODAL_TYPE, ({ key, label }, index) => {
            return <Tab key={key} label={label()} value={index} />;
          })}
        </Tabs>
      </TabWrapper>
    ),
    [modalType],
  );

  const coinsList = useMemo(
    () => (
      <Fragment>
        <CoinSelectTitle>{_t('trans.currency')}</CoinSelectTitle>
        <CoinSelectWrapper>
          {map(coins, (item, index) => {
            return (
              <CoinSelectTabItem
                key={item}
                onClick={() => setCurrencyIndex(index)}
                active={index === currencyIndex}
              >
                <CoinIconWrapper>
                  <CoinIconPro currency={item} size={24} />
                  {!!modalConfig.showCurrencyDesc && (
                    <CoinSelectTabDesc>
                      {item === quote
                        ? _t('long.currency', { currency: baseName })
                        : _t('short.currency', { currency: baseName })}
                    </CoinSelectTabDesc>
                  )}
                </CoinIconWrapper>
              </CoinSelectTabItem>
            );
          })}
        </CoinSelectWrapper>
      </Fragment>
    ),
    [coins, quote, baseName, modalType, currencyIndex],
  );

  const sizeLabel = useMemo(
    () => (
      <CanBorrowWrapper isRepay={!!modalType}>
        {TRADE_TYPES_CONFIG[tradeType]?.accountName?.()}{' '}
        {modalConfig.amountExtraTitle()}：
        <BorrowBtn onClick={() => setSize(max)}>
          <CoinPrecision value={max} coin={currentCurrency} />
        </BorrowBtn>
      </CanBorrowWrapper>
    ),
    [max, modalType, tradeType, currentCurrency],
  );

  const tips = useMemo(() => {
    const symbol =
      tradeType === 'MARGIN_TRADE'
        ? ''
        : `-${baseName}/${quoteName}`;
    return `${TRADE_TYPES_CONFIG[tradeType]?.accountName?.()}${symbol}`;
  }, [tradeType, baseName, quoteName]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  useEffect(() => {
    if (!visible) {
      document.removeEventListener('keydown', handleKeyDown);
    } else {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, handleKeyDown]);

  return (
    <DialogWrapper
      size="medium"
      open={visible}
      title={title}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={_t('confirm')}
      cancelText={_t('cancel')}
      okButtonProps={{
        loading: confirmLoading,
      }}
      headerProps={{ border: true }}
      {...rest}
    >
      <Fragment>
        <Tip>{tips}</Tip>
        <Form form={form}>
          <FormItem>{coinsList}</FormItem>
          <FormItem
            label={_t('margin.number')}
            name="size"
            rules={[{ validator: triggerSizeValidator }]}
            // validateTrigger="onBlur"
          >
            <InputNumber
              size="large"
              placeholder={modalConfig.amountPlaceholder(liability)}
              unit={modalConfig.getAmountInputAddonAfter(currentCurrency, () =>
                fastClickAll(liability),
              )}
              controls={false}
            />
          </FormItem>

          {modalConfig.showAmountUtil && (
            <FastButtonGroup onChange={amountFastSet} />
          )}
          {sizeLabel}
        </Form>
        {subscribeSocket({ visible, tradeType })}
      </Fragment>
    </DialogWrapper>
  );
};

export default connect((state) => {
  const categories = state.categories;
  const { currentSymbol, tradeType } = state.trade;
  const { marginModalConfig } = state.marginMeta;
  const { currentLang } = state.app;
  return {
    tradeType,
    categories,
    currentSymbol,
    marginModalConfig,
    currentLang,
  };
})(MarginModal);
