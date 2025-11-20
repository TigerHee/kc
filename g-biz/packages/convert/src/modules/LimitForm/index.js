/*
 * owner: borden@kupotech.com
 */
import { has, isNil } from 'lodash';
import loadable from '@loadable/component';
import { useTranslation } from '@tools/i18n';
import { Form, useLatest, useEventCallback, useSnackbar, useResponsive } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
import { kcsensorsManualTrack } from '@utils/sensors';
import React, { useRef, useState, useEffect } from 'react';
import FieldWrapper from '../../components/FieldWrapper';
import SubmitButton from '../../components/SubmitButton';
import InputNumber from '../../components/InputNumber';
import SwapButton from '../../components/SwapButton';
import usePolling from '../../hooks/common/usePolling';
import useContextSelector from '../../hooks/common/useContextSelector';
import useIsDocumentVisible from '../../hooks/common/useIsDocumentVisible';
import useDebounceFn from '../../hooks/common/useDebounceFn';
import useFromField from '../../hooks/form/useFromField';
import useToField from '../../hooks/form/useToField';
import * as validator from '../../utils/validator';
import { isFinite, multiply, dividedBy, comparedTo, formatNumberByStep } from '../../utils/format';
import {
  getInverseSymbol,
  getOppositionFieldName,
  calcPrice,
  getSymbolConfig,
} from '../../utils/tools';
import { NAMESPACE, ACCOUNT_TYPE_LIST_MAP } from '../../config';
import { computeLimitTax } from '../../services/convert';
import EtfAlert from '../EtfAlert';
import PricePanel from './PricePanel';
import { StyledForm } from './style';
import { useConvertSymbolsMap, useFromCurrency, useToCurrency } from '../../hooks/form/useStoreValue';

const { useForm, useWatch, FormItem } = Form;

const ResultDialog = loadable(() => import('../ResultDialog'));
const ConfirmDialog = loadable(() => import('../ConfirmDialog'));
const RestrictedDialog = loadable(() => import('../RestrictedDialog'));

// fromSize、toSize、price三者联动逻辑触发的节流间隔
const LINKAGE_DEBOUNCE_WAIT = 500;

const LimitForm = ({ visible, onCancel }) => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const { message } = useSnackbar();
  const { t: _t } = useTranslation('convert');
  const isDocumentVisible = useIsDocumentVisible();

  const toCurrencySize = useWatch('toCurrencySize', form);
  const fromCurrencySize = useWatch('fromCurrencySize', form);

  const isLogin = useContextSelector((state) => Boolean(state.user));
  const currenciesMap = useContextSelector((state) => state.currenciesMap);
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const accountType = useSelector((state) => state[NAMESPACE].accountType);
  const priceSymbol = useSelector((state) => state[NAMESPACE].priceSymbol);
const convertSymbolsMap = useConvertSymbolsMap();
  const timer = useRef();
  // “限价”的正反价格map信息，key是交易对
  const priceInfo = useRef({});
  // 由于输入“获得”，计算的值可能是“消耗”，也可能是“价格”，为避免同一批次(以同一次聚焦为准)输入计算不同的值的问题
  // 故在每次聚焦“获得”框的时候，锁定一下计算的状态名；失焦的时候会将该状态名释放掉
  const lockedCalcFieldName = useRef();
  // 是否填充过市价，因为询价有轮训，同批次(同一组币种)轮训，只在首次拉取进行填充
  const isFilledPrice = useRef(false);
  const latestPriceSymbol = useLatest(priceSymbol);
  const latestToCurrencySize = useLatest(toCurrencySize);
  const latestFromCurrencySize = useLatest(fromCurrencySize);
  const { run, isRunning, cancel, onlyCancel } = usePolling(
    `${NAMESPACE}/queryPriceForLimitOrder`,
    `${NAMESPACE}/triggerLimitPolling`,
  );
  // “价格”输入框的value
  const [price, setPrice] = useState();
  // 结果弹窗的类型: success | fail | undefined
  const [result, setResult] = useState();
  // 市价信息，包含正反价格
  const [marketPrice, setMarketPrice] = useState(null);
  // 限价 > 市价，会造成损失，所以需要在这种情形下阻止下单
  const [isErrorPrice, setIsErrorPrice] = useState(false);
  // 是否自动填充的价格。自动填充价格不展示比较
  const [isAutoFillPrice, setIsAutoFillPrice] = useState(true);
  // 二次确认弹窗的透窗信息
  const [confirmExtraInfo, setConfirmExtraInfo] = useState(null);
  // 当前的计算项目，需要在该项目的label上加上"预估"二字
  const [estimateFieldName, setEstimateFieldName] = useState('toCurrencySize');

  const { currencyName = '' } = currenciesMap[toCurrency] || {};
  const isEmptyForm = [fromCurrencySize, toCurrencySize].every(isNil);

  // 限价单曝光上报
  useEffect(() => {
    kcsensorsManualTrack({ spm: ['convertForm', '2'] }, 'expose');
  }, []);

  useEffect(() => {
    return () => {
      cancel();
      clearTimer();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      cancel();
      form.resetFields();
    }
  }, [visible, form, cancel]);

  useEffect(() => {
    if (!isLogin) return;
    isFilledPrice.current = false;
    setPrice();

    queryPrice();
  }, [isLogin, fromCurrency, toCurrency]);
  // 处理网页可见性切换的时候，重启询价轮训的逻辑
  useEffect(() => {
    // isDocumentVisible初始化为undefined
    if (isDocumentVisible && isRunning) {
      queryPrice();
    } else if (isDocumentVisible === false) {
      onlyCancel();
    }
  }, [isDocumentVisible, run, onlyCancel]);

  useEffect(() => {
    // 币种变更， 清空输入的所有数量
    form.resetFields();
  }, [form, fromCurrency, toCurrency]);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  // 询市价函数，params传入则只请求一次而不轮训，用在部分需要强刷市价的场景
  const queryPrice = useEventCallback((params) => {
    if (!isLogin) return;
    const { successCallback, errorCallback } = params || {};
    const payload = {
      toCurrency,
      fromCurrency,
      coefficientEnable: Boolean(params),
      getSizeInfo: () => {
        const formErrors = form.getFieldsError();
        // 表单校验失败
        if (formErrors.some((item) => item.errors.length)) {
          return null;
        }
        if (latestToCurrencySize.current) {
          return { toSize: latestToCurrencySize.current };
        }
        if (latestFromCurrencySize.current) {
          return { fromSize: latestFromCurrencySize.current };
        }
        return null;
      },
      onSuccess: (data) => {
        const { fromCurrency: quote, toCurrency: base, price, inversePrice } = data;
        const newPriceInfo = {
          [`${quote}-${base}`]: price,
          [`${base}-${quote}`]: inversePrice,
        };
        if (typeof successCallback === 'function') {
          return successCallback(newPriceInfo);
        }
        setMarketPrice(newPriceInfo);
        // 同一批次轮训(同fromCurrency、同toCurrency)，只在首次拉取到市价的时候进行填充
        if (!isFilledPrice.current) {
          isFilledPrice.current = true;
          priceInfo.current = newPriceInfo;
          setPrice(price);
          setIsAutoFillPrice(true);
        }
      },
      onError: (e) => {
        if (typeof errorCallback === 'function') {
          errorCallback(e);
        }
      },
    };
    if (params) {
      dispatch({
        payload,
        type: `${NAMESPACE}/queryPriceForLimitOrder`,
      });
    } else {
      run(payload);
    }
  });
  // 消耗数量、获得数量、限价三者的联动逻辑
  const { run: onValuesChange } = useDebounceFn(
    (changedValues) => {
      const allValues = { ...form.getFieldsValue(true), ...changedValues };
      const currentPrice = priceInfo.current[latestPriceSymbol.current];
      const isInversePrice = latestPriceSymbol.current === `${toCurrency}-${fromCurrency}`;
      const { stepSize, tickSize } = getSymbolConfig(toCurrency, fromCurrency, convertSymbolsMap);
      // 输入“获得”
      if (has(changedValues, 'toCurrencySize')) {
        const isValidSize = comparedTo(changedValues.toCurrencySize, 0) > 0;
        // “消耗”有值，则计算“价格”
        if (lockedCalcFieldName.current === 'fromCurrencySize') {
          let newPrice;
          if (isValidSize) {
            // 计算出价格
            const ret = calcPrice(
              dividedBy(changedValues.toCurrencySize)(allValues.fromCurrencySize),
              isInversePrice,
            );
            // 小于等于0， 则填充0
            newPrice = comparedTo(ret, 0) > 0 ? ret : 0;
          }
          // 更新预估字段名
          setEstimateFieldName('price');
          updatePrice(newPrice, false);
        } else if (lockedCalcFieldName.current === 'price') {
          let newFromCurrencySize;
          if (isValidSize) {
            // 根据价格计算“消耗”，需要判断是正向价格还是反向价格，正向相乘，反向相除
            const calcFn = isInversePrice ? multiply : dividedBy;
            // “消耗”无值，“价格”有值，则计算“消耗”
            newFromCurrencySize = formatNumberByStep(
              calcFn(changedValues.toCurrencySize)(currentPrice),
              tickSize,
              'UP',
            );
            newFromCurrencySize = isFinite(newFromCurrencySize) ? newFromCurrencySize : undefined;
          }
          // 更新预估字段名
          setEstimateFieldName('fromCurrencySize');
          // 更新 & 校验更新
          form.setFieldsValue({ fromCurrencySize: newFromCurrencySize });
          if (!isNil(newFromCurrencySize)) form.validateFields(['fromCurrencySize']);
        }
      } else if (['fromCurrencySize', 'price'].some((v) => has(changedValues, v))) {
        let newToCurrencySize;
        if ([allValues.fromCurrencySize, currentPrice].every((v) => comparedTo(v, 0) > 0)) {
          // 输入“消耗”或者“价格”，计算“获得”
          const calcFn = isInversePrice ? dividedBy : multiply;
          newToCurrencySize = formatNumberByStep(
            calcFn(allValues.fromCurrencySize)(currentPrice),
            stepSize,
          );
          newToCurrencySize = isFinite(newToCurrencySize) ? newToCurrencySize : undefined;
        }
        // 更新预估字段名
        setEstimateFieldName('toCurrencySize');
        // 更新 & 校验更新
        form.setFieldsValue({ toCurrencySize: newToCurrencySize });
        if (!isNil(newToCurrencySize)) form.validateFields(['toCurrencySize']);
      }
    },
    { wait: LINKAGE_DEBOUNCE_WAIT },
  );

  // key为价格交易度， value为新价格
  const updatePriceInfo = (key, value) => {
    // 新价格为空，同时清空正向价格、反向价格
    if (isNil(value)) {
      priceInfo.current = {};
      return;
    }
    // 获取反向交易对
    const inverseSymbol = getInverseSymbol(key);
    // 反向价格 = 1 / 正向价格
    const inversePrice = calcPrice(value, true);
    priceInfo.current = {
      [key]: value,
      [inverseSymbol]: isFinite(inversePrice) ? inversePrice : 0,
    };
  };

  const updatePrice = useEventCallback((val, isTriggerValuesChange, isUpdateAutoFillPrice) => {
    // 此方法只用于根据fromSize、toSize计算 & 价格输入框手动输入 的时候更新价格。所以调用后将是否自动填充的价格改为false
    if (isUpdateAutoFillPrice !== false) setIsAutoFillPrice(false);
    setPrice((pre) => {
      if (pre !== val) {
        // 更新价格map(正向价格、反向价格)，预览、三者联动以及价格交易对，都要依赖
        if (priceInfo.current?.[priceSymbol] !== val) {
          updatePriceInfo(priceSymbol, val);
        }
        // 触发价格输入后的联动机制
        if (isTriggerValuesChange !== false) {
          onValuesChange({ price: val });
        }
        return val;
      }
      return pre;
    });
  });

  const handleReverse = useEventCallback(() => {
    // 反转币种后，预估字段名也要跟着反转
    if (['fromCurrencySize', 'toCurrencySize'].includes(estimateFieldName)) {
      const newEstimateFieldName = getOppositionFieldName({ [estimateFieldName]: 1 });
      setEstimateFieldName(newEstimateFieldName);
    }
  });

  const handleReversePriceSymbol = useEventCallback(({ base, quote }) => {
    // 切换价格为反向价格后，输入框里的价格也要切换为其对应的反向价格
    setPrice(priceInfo.current[`${base}-${quote}`]);
  });

  const onResultModalOk = useEventCallback((...rest) => {
    form.resetFields();
    updatePrice(marketPrice[priceSymbol], false, false);
    setIsAutoFillPrice(true);
    if (onCancel) onCancel(...rest);
  });

  const handleSubmit = useEventCallback(() => {
    queryPrice({
      errorCallback: (e) => {
        if (e?.msg) message.error(e.msg);
      },
      successCallback: (data) => {
        const trade_pair = `${fromCurrency}-${toCurrency}`;
        const {
          [`${toCurrency}-${fromCurrency}`]: _price,
          [`${fromCurrency}-${toCurrency}`]: _inversePrice,
        } = priceInfo.current;
        // 限价 < 市价，会造成损失，所以需要在这种情形下阻止下单
        if (comparedTo(_inversePrice, data[trade_pair]) < 0) {
          setIsErrorPrice(true);
          return;
        }
        setIsErrorPrice(false);

        const results = {
          trade_pair,
          pricing_type: 'limit',
          trade_service_type: 'flash_trade',
        };
        dispatch({
          type: `${NAMESPACE}/confirmLimitOrder`,
          payload: {
            toCurrency,
            accountType,
            fromCurrency,
            price: _price,
            channel: 'WEB_CONVERT',
            toSize: toCurrencySize,
            fromSize: fromCurrencySize,
            inversePrice: _inversePrice,
          },
        })
          .then((res) => {
            if (res?.success) {
              results.is_success = true;
              results.fail_reason = 'none';
              results.fail_reason_code = 'none';
              setResult({ type: 'success', onOk: onResultModalOk });
              // 刷新余额
              dispatch({
                type: `${NAMESPACE}/pullPosition`,
              });
            } else {
              results.is_success = false;
              results.fail_reason_code = res?.code;
              results.fail_reason = `${res?.code || ''}:${res?.msg || ''}`;
              // 强制kyc3限制（400303 母账号交易受限 400304 子账号交易受限）
              if ([400303, 400304].includes(+res?.code)) {
                RestrictedDialog.preload();
                dispatch({
                  type: `${NAMESPACE}/getKyc3TradeLimitInfo`,
                  payload: { status: 'KYC_LIMIT' },
                });
              } else if ([600000].includes(+res?.code)) {
                // 印度pan码填写
                dispatch({
                  type: `${NAMESPACE}/update`,
                  payload: { taxInfoCollectDialogOpen: true },
                });
              } else {
                setResult({ type: 'fail', errorMsg: res?.msg });
              }
            }
          })
          .finally(() => {
            handleCloseConfirmModal();
            kcsensorsManualTrack({ checkID: false, data: results }, 'trade_results');
          });
      },
    });
  });

  const handleOpenConfirmModal = useEventCallback(() => {
    cancel();
    const originPrice = dividedBy(toCurrencySize)(fromCurrencySize);
    const { accountTypes } = ACCOUNT_TYPE_LIST_MAP[accountType] || {};
    // 根据获得数量和消耗数量计算出真实成交价格，在二次确认弹窗中展示
    setConfirmExtraInfo((pre) => ({
      ...pre,
      [`${fromCurrency}-${toCurrency}`]: calcPrice(originPrice),
      [`${toCurrency}-${fromCurrency}`]: calcPrice(originPrice, true),
    }));
    // 获取"税"费，拉取失败或者值为undefined | null,则不展示该字段
    computeLimitTax({
      toCurrency,
      fromCurrency,
      accountTypes,
      channel: 'WEB_CONVERT',
      toSize: toCurrencySize,
      fromSize: fromCurrencySize,
    }).then((res) => {
      if (res?.data) {
        setConfirmExtraInfo((pre) => ({
          ...pre,
          taxSize: res.data.taxSize,
          taxCurrency: res.data.taxCurrency,
        }));
      }
    });
    kcsensorsManualTrack({ spm: ['limit', 'placeOrder'] }, 'page_click');
  });

  const handleCloseConfirmModal = useEventCallback((isClickCancel) => {
    setConfirmExtraInfo(null);
    // 手动关闭二次确认弹窗，重启询价
    if (isClickCancel) {
      queryPrice();
    }
    setIsErrorPrice(false);
  });

  const handleCancelResultDialog = useEventCallback(() => {
    setResult(null);
    // 关闭结果弹窗，重启询价
    queryPrice();
  });

  // “获得”数量框聚焦，获取该批次输入的计算状态名
  const onFocusToCurrencySize = useEventCallback(() => {
    clearTimer();
    if (form.getFieldValue('fromCurrencySize')) {
      lockedCalcFieldName.current = 'fromCurrencySize';
    } else if (priceInfo.current[priceSymbol]) {
      lockedCalcFieldName.current = 'price';
    }
  });
  // “获得”数量框失焦，释放该批次输入的计算状态名
  // 延时是为了避免在输入完，触发联动逻辑的时候，立即失焦计算锁被取消，而导致联动逻辑不触发的问题
  const onBlurToCurrencySize = useEventCallback(() => {
    timer.current = setTimeout(() => {
      lockedCalcFieldName.current = undefined;
    }, LINKAGE_DEBOUNCE_WAIT);
  });

  const triggerValidate = useEventCallback((key, val) => {
    const setFields = (e) => {
      form.setFields([
        {
          name: key,
          value: val,
          errors: e?.message ? [e.message] : [],
        },
      ]);
    };
    validator[`${key}Validator`](val)
      .then(setFields)
      .catch(setFields);
  });

  const toField = useToField({
    estimateFieldName,
    value: toCurrencySize,
    onChange: (v) => onValuesChange({ toCurrencySize: v }),
    inputNumberProps: {
      onBlur: onBlurToCurrencySize,
      onFocus: onFocusToCurrencySize,
    },
  });
  const fromField = useFromField({
    form,
    triggerValidate,
    estimateFieldName,
    value: fromCurrencySize,
    onChange: (v) => onValuesChange({ fromCurrencySize: v }),
  });

  return (
    <StyledForm form={form} onFinish={handleOpenConfirmModal} data-inspector="convert_limit_form">
      <FieldWrapper {...fromField.wrapperProps}>
        <FormItem {...fromField.formItemProps}>
          <InputNumber
            {...fromField.inputNumberProps}
            data-inspector="convert_limit_form_from_input"
          />
        </FormItem>
      </FieldWrapper>
      <SwapButton onClick={handleReverse} />
      <FieldWrapper {...toField.wrapperProps}>
        <FormItem {...toField.formItemProps}>
          <InputNumber {...toField.inputNumberProps} data-inspector="convert_limit_form_to_input" />
        </FormItem>
      </FieldWrapper>
      <EtfAlert />
      <PricePanel
        value={price}
        onChange={updatePrice}
        marketPrice={marketPrice}
        isAutoFillPrice={isAutoFillPrice}
        estimateFieldName={estimateFieldName}
        onReverse={handleReversePriceSymbol}
      />
      {isLogin && !isEmptyForm && (
        <>
          <ConfirmDialog
            data-inspector="convert_limit_confirm_dialog"
            onOk={handleSubmit}
            isErrorPrice={isErrorPrice}
            priceInfo={confirmExtraInfo}
            toCurrencySize={toCurrencySize}
            open={Boolean(confirmExtraInfo)}
            onCancel={handleCloseConfirmModal}
            fromCurrencySize={fromCurrencySize}
          />
          <ResultDialog
            data-inspector={`convert_limit_result_${result?.type}_dialog`}
            pageType="current"
            toCurrencySize={toCurrencySize}
            onCancel={handleCancelResultDialog}
            fromCurrencySize={fromCurrencySize}
            {...result}
          />
        </>
      )}
      <SubmitButton style={{ marginTop: sm ? 32 : 28 }}>
        {isEmptyForm
          ? _t('7SC1QGsDyKE4WDGPfqJRD9')
          : _t('7RiVCUUeoCzKQZpcsFXEBt', { currency: currencyName })}
      </SubmitButton>
    </StyledForm>
  );
};

export default React.memo(LimitForm);
