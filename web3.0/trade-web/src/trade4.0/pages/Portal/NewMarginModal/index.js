/*
 * owner: borden@kupotech.com
 */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  Fragment,
} from 'react';
import { map, includes, merge } from 'lodash';
import { useTheme } from '@emotion/react';
import { useDebounceEffect } from 'ahooks';
import { useDispatch, useSelector } from 'dva';
import { useSnackbar } from '@kux/mui/hooks';
import { useResponsive } from '@kux/mui';
import { ICTransfer2Outlined } from '@kux/icons';
import Form from '@mui/Form';
import InputNumber from '@mui/InputNumber';
import CoinPrecision from '@/components/CoinPrecision';
import CoinCodeToName from '@/components/CoinCodeToName';
import FastButtonGroup from '@/components/FastButtonGroup';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import { getCoinInfoFromStore } from '@/utils/stateGetter';
import { event } from '@/utils/event';
import voice from '@/utils/voice';
import { _t } from 'src/utils/lang';
import { multiplyFloor } from 'src/helper';
import useReferRate from './hooks/useReferRate';
import { MODAL_TYPE, ACCOUNT_TYPE_MAP } from './config';
import {
  validateNoop,
  validateEmpty,
  getLoanCurrencyFromSymbol,
  checkCurrencyIsSupportCrossLoan,
  checkCurrencyIsSupportIsolatedLoan,
} from './utils';
import {
  InfoPanel,
  ModalTitle,
  AccountSwitch,
  InterestFreeCoupons,
  CrossCurrencySwitch,
  IsolatedTagsSelector,
  CurrencySwitchForSymbol,
} from './components';
import {
  StyledDialog,
  StyledLeverageSetting,
  StyledTooltipWrapper,
} from './style';

const { FormItem, useForm } = Form;

const NewMarginModal = React.memo(() => {
  const [form] = useForm();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const { message } = useSnackbar();
  const crossCurrencySwitchRef = useRef();
  const marginModalConfig = useSelector(
    (state) => state.marginMeta.marginModalConfig,
  );

  const tag = Form.useWatch('tag', form);
  const currency = Form.useWatch('currency', form);

  const {
    open,
    tag: initTag,
    currency: _initCurrency,
    modalType: initModalType,
    accountType: initAccountType,
  } = marginModalConfig;
  const { resetFields, setFieldsValue, validateFields } = form;

  const [modalType, setModalType] = useState(0);
  const [accountType, setAccountType] = useState();
  const [positionData, setPositionData] = useState(null);

  const modalConfig = MODAL_TYPE[modalType];
  const referRate = useReferRate({
    currency,
    showReferRate: open && includes(modalConfig?.positionInfoKeys, 'referRate'),
  });
  const showLeverageSetting =
    open && includes(modalConfig?.positionInfoKeys, 'borrowAmount');
  const confirmLoading = useSelector(
    (state) => state.loading.effects[modalConfig?.postEffect?.(accountType)],
  );
  const {
    getInitDict,
    getPositionKey,
    pullPostionByTag,
    checkTransferAction,
    pullPostionByCurrency,
    getInitTagForLeverageModal,
    checkTransferIsChangePosition,
  } = ACCOUNT_TYPE_MAP[accountType] || {};
  const position = positionData?.[getPositionKey(tag)];

  const currencyPosition = position?.[currency];
  const { liability = 0 } = currencyPosition || {};
  // 百分比相对的数据
  const maxSize = modalConfig?.getMaxSize?.(currencyPosition) || 0;
  // 校验用的最大输入
  const maxInputSize =
    currencyPosition?.[modalConfig?.maxInputSizeKey] || 0;

  // 监听事件
  useEffect(() => {
    if (open) {
      // 监听划转成功事件，触发仓位刷新
      event.on('transfer.success', onTransferEvent);
    }
    return () => {
      if (open) {
        event.off('transfer.success');
      }
    };
  }, [open]);

  // 监听事件
  useEffect(() => {
    if (showLeverageSetting) {
      // 监听倍数成功事件，触发仓位刷新
      event.on('changeLeverage.success', pullPostion);
    }
    return () => {
      if (showLeverageSetting) {
        event.off('changeLeverage.success');
      }
    };
  }, [showLeverageSetting]);
  // 打开弹窗，初始化弹窗内容
  useEffect(() => {
    if (open) {
      setModalType(initModalType);
      setAccountType(initAccountType);

      const initCurrency =
        _initCurrency || getLoanCurrencyFromSymbol(initAccountType, initTag);
      setFieldsValue({ tag: initTag, currency: initCurrency });
    }
  }, [marginModalConfig]);
  // 切换全/逐仓, 校验币种是否仍然合法，不合法重置为合法币种
  useEffect(() => {
    resetCurrencyOnTriggerAccount();
  }, [tag]);
  // 逐仓仓位拉取逻辑
  useDebounceEffect(
    () => {
      if (open && pullPostionByTag) {
        pullPostionByTag({
          tag,
          callback: pullPostionCallback,
        });
      }
    },
    [open, accountType, tag],
    { wait: 200 },
  );
  // 全仓仓位拉取逻辑
  useDebounceEffect(
    () => {
      if (open && pullPostionByCurrency) {
        pullPostionByCurrency({
          currency,
          callback: pullPostionCallback,
        });
      }
    },
    [open, accountType, currency],
    { wait: 200 },
  );
  // 切换借/还、全/逐、币种，都清空数量输入框
  useEffect(() => {
    if (open) {
      resetFields(['size']);
    }
  }, [open, modalType, accountType, currency]);

  const pullPostionCallback = useMemoizedFn((data, ...rest) => {
    setPositionData((pre) => ({
      ...merge(pre, { [getPositionKey(...rest)]: data }),
    }));
  });

  const pullPostion = useMemoizedFn(() => {
    const fetchFn = pullPostionByTag || pullPostionByCurrency;
    if (fetchFn) {
      fetchFn({
        tag,
        currency,
        callback: pullPostionCallback,
      });
    }
  });

  const resetCurrencyOnTriggerAccount = useMemoizedFn(() => {
    let nextCurrency;
    if (tag) {
      // 切换到逐仓，当前币种不支持该逐仓借贷的话，则重置为支持该逐仓借贷的币种(优先quote)
      if (!checkCurrencyIsSupportIsolatedLoan(currency, tag)) {
        nextCurrency = getLoanCurrencyFromSymbol(accountType, tag);
      }
    } else if (!checkCurrencyIsSupportCrossLoan(currency)) {
      // 切到全仓，当前币种不支持全仓借贷的话，则重置币种为 USDT
      nextCurrency = 'USDT';
    }
    if (nextCurrency) {
      setFieldsValue({ currency: nextCurrency });
    }
  });

  const onTransferEvent = useMemoizedFn((transferInfo) => {
    // 划转之后触发仓位刷新
    if (checkTransferIsChangePosition?.({ ...transferInfo, tag })) {
      pullPostion();
    }
    // 全仓划转之后，刷新币种下拉列表
    if (checkTransferAction?.(transferInfo) && crossCurrencySwitchRef.current) {
      crossCurrencySwitchRef.current.refresh();
    }
  });

  const onChangeModelType = useCallback((e, v) => {
    setModalType(v);
  }, []);

  const onChangeAccountType = useCallback(
    (v) => {
      setAccountType(v);
      const { getInitTag } = ACCOUNT_TYPE_MAP[v] || {};
      if (getInitTag) {
        const _initTag = getInitTag({ currency });
        setFieldsValue({ tag: _initTag });
      }
    },
    [currency],
  );

  const handleChangePercent = useCallback(
    (v) => {
      let nextSize = 0;
      const sizePrecision = modalConfig?.getSizePrecision({ currency, tag });
      if (maxSize) {
        const args = [maxSize, v, ...(sizePrecision ? [sizePrecision] : [])];
        nextSize = +multiplyFloor(...args);
      }
      if (!isNaN(nextSize)) {
        setFieldsValue({ size: nextSize });
        validateFields(['size']);
      }
    },
    [maxSize, modalType, currency, tag],
  );

  const openTransferModal = useCallback(() => {
    const initDict = getInitDict?.(tag);
    if ([initDict, currency].some((v) => !v)) return;
    dispatch({
      type: 'transfer/updateTransferConfig',
      payload: {
        initDict,
        visible: true,
        initCurrency: currency,
      },
    });
  }, [accountType, currency, tag]);

  const handleOpenLeverageModal = useCallback(() => {
    const payload = {
      open: true,
      accountType,
    };
    const _initTag = getInitTagForLeverageModal?.({ tag, currency });
    if (_initTag) {
      payload.tag = _initTag;
    }
    dispatch({
      type: 'isolated/updateLeverageModalConfig',
      payload,
    });
  }, [accountType, tag, currency]);

  const onCancel = useCallback(() => {
    dispatch({
      type: 'marginMeta/updateMarginModalConfig',
      payload: {
        open: false,
      },
    });
  }, []);

  const onOk = useCallback(() => {
    validateFields().then((values) => {
      const { postEffect, postCallback, defaultParams } = modalConfig;
      const { size, tag: _tag, currency: _currency, ...params } = values;
      const payload = {
        ...defaultParams,
        size,
        symbol: _tag,
        currency: _currency,
        ...params,
      };
      dispatch({
        payload,
        type: postEffect(accountType),
      })
        .then((res) => {
          if (res?.success) {
            const { currencyName = '' } = getCoinInfoFromStore(_currency);
            postCallback({
              size,
              message,
              liability,
              currencyName,
              data: res.data,
            });
            event.emit('loanChange.success', { accountType, tag: _tag });
            onCancel();
          }
        })
        .catch((e) => {
          //  210006: 还款中; 210007: 借款中
          if ([210006, 210007].some((v) => +e?.code === v)) {
            onCancel();
            return;
          }
          // 印度PAN码拦截
          if ([600000].includes(+e?.code)) {
            dispatch({
              type: 'dialog/updateTaxInfoCollectDialogConfig',
              payload: {
                open: true,
                source: 'margin',
              },
            });
          }
        });
    }).catch(() => {
      voice.notify('error_boundary');
    });
  }, [modalType, accountType, liability]);

  const getDataSource = () => {
    const info = {
      referRate: {
        key: 'referRate',
        label: (
          <StyledTooltipWrapper
            useUnderline
            title={_t('isolated.trade.rateTip')}
          >
            {_t('isolated.trade.rate')}
          </StyledTooltipWrapper>
        ),
        value: referRate,
      },
      liability: {
        key: 'liability',
        label: _t('192aSr8iuJPjs2fviG8dvg'),
        value: (
          <CoinPrecision
            coin={currency}
            value={currencyPosition?.liability}
          />
        ),
      },
      availableBalance: {
        key: 'availableBalance',
        label: _t('bv4u5WW4GNncSY7BfkJmus'),
        value: (
          <Fragment>
            <span className="mr-4">
              <CoinPrecision
                coin={currency}
                value={currencyPosition?.availableBalance}
              />
            </span>
            <StyledTooltipWrapper disabledOnMobile title={_t('transfer.s')}>
              <ICTransfer2Outlined
                color={colors.primary}
                onClick={openTransferModal}
                style={{ cursor: 'pointer' }}
              />
            </StyledTooltipWrapper>
          </Fragment>
        ),
      },
      borrowAmount: {
        key: 'borrowAmount',
        label: (
          <Fragment>
            {_t('margin.can.borrow')}
            <StyledLeverageSetting
              className="ml-8"
              onClick={handleOpenLeverageModal}
              userLeverage={position?.userLeverage || '-'}
            />
          </Fragment>
        ),
        value: (
          <CoinPrecision
            coin={currency}
            value={currencyPosition?.borrowAmount}
          />
        ),
      },
      interestFreeCoupon: {
        key: 'interestFreeCoupon',
        component: <InterestFreeCoupons currency={currency} />,
      },
    };
    return map(modalConfig?.positionInfoKeys, (v) => info[v]);
  };

  return (
    <StyledDialog
      open={open}
      onOk={onOk}
      height="90%"
      size="medium"
      destroyOnClose
      onCancel={onCancel}
      okText={_t('confirm')}
      cancelText={_t('cancel')}
      footerProps={{ border: true }}
      headerProps={{ border: true }}
      okButtonProps={{ loading: confirmLoading }}
      title={<ModalTitle value={modalType} onChange={onChangeModelType} />}
    >
      <AccountSwitch value={accountType} onChange={onChangeAccountType} />
      <Form form={form}>
        {Boolean(ACCOUNT_TYPE_MAP[accountType]?.showTagField) && (
          <FormItem noStyle name="tag">
            <IsolatedTagsSelector size={sm ? 'xlarge' : 'medium'} />
          </FormItem>
        )}
        <FormItem noStyle name="currency">
          {tag ? (
            <CurrencySwitchForSymbol
              symbol={tag}
              showDict={modalConfig?.showDict}
            />
          ) : (
            <CrossCurrencySwitch
              open={open}
              ref={crossCurrencySwitchRef}
              sortor={modalConfig?.sortor}
              size={sm ? 'xlarge' : 'medium'}
            />
          )}
        </FormItem>
        <InfoPanel dataSource={getDataSource()} />
        <FormItem
          name="size"
          rules={[
            {
              validator: validateEmpty,
              validateTrigger: 'onSubmit',
            },
            {
              validator: (_, value) =>
                (modalConfig?.validatorSize || validateNoop)({
                  tag,
                  value,
                  currency,
                  max: +maxInputSize,
                }),
            },
          ]}
        >
          <InputNumber
            controls={false}
            size={sm ? 'xlarge' : 'medium'}
            placeholder={_t('margin.number')}
            unit={<CoinCodeToName coin={currency} />}
          />
        </FormItem>
        <FastButtonGroup size="large" onChange={handleChangePercent} />
      </Form>
    </StyledDialog>
  );
});

export default NewMarginModal;
