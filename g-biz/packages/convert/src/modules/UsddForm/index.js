/*
 * owner: june.lee@kupotech.com
 */
import { ICArrowRightOutlined, ICArrowLeftOutlined } from '@kux/icons';
import { has, isNil, noop } from 'lodash';
import loadable from '@loadable/component';
import { useTranslation } from '@tools/i18n';
import { Form, useEventCallback, useResponsive } from '@kux/mui';
import { kcsensorsManualTrack } from '@utils/sensors';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react';
import InputNumber from '../../components/InputNumber';
import FieldWrapper from '../../components/FieldWrapper';
import SubmitButton from '../../components/SubmitButton';
import UsddSwapButton from './UsddSwapButton';
import useDebounceFn from '../../hooks/common/useDebounceFn';
import useUSDDFromField from './hooks/useUSDDFromField';
import usePolling from '../../hooks/common/usePolling';
import useContextSelector from '../../hooks/common/useContextSelector';
import useIsDocumentVisible from '../../hooks/common/useIsDocumentVisible';
// import { isEqualPair, getOppositionFieldName } from '../../utils/tools';
import { NAMESPACE, MAX_PRICE_EXPIRE_TIME } from '../../config';
import { sentryCaptureEvent, getOppositionFieldName } from '../../utils/tools';
import * as validator from './utils/usddValidator';
import { comparedTo, multiply } from '../../utils/format';
import EtfAlert from '../EtfAlert';
import PriceInfo from './PriceInfo';
import PriceNotice from './PriceNotice';
import ButtonWrapper from './ButtonWrapper';
import { ConvertLimit, StyledForm } from './style';
import useUSDDToField from './hooks/useUSDDToField';
import useIsRTL from '../../hooks/common/useIsRTL';
import { useConvertSymbolsMap, useFromCurrency, useToCurrency } from '../../hooks/form/useStoreValue';

const ConfirmDialog = loadable(() => import('./UsddConfirmDialog'));
const ResultDialog = loadable(() => import('./UsddResultDialog'));
const RestrictedDialog = loadable(() => import('../RestrictedDialog'));
const UsddLimitDialog = loadable(() => import('./UsddLimitDialog'));

const { useForm, useWatch, FormItem } = Form;
let lastRequestId = 0;

const isInRange = (code, start, end) => code >= start && code <= end;
const isInCludes = (code, arr) => arr.includes(code);

// 市价询价时展示横条提示信息
const getTdErrorMsg = (e) => {
  const { code: _code, msg } = e || {};
  const code = +_code;

  return code &&
    msg &&
    (isInRange(code, 400200, 400302) ||
      isInRange(code, 50070, 50088) ||
      isInCludes(code, [5030, 60024]))
    ? msg
    : null;
};

const USDDForm = ({ visible, onCancel }) => {
  const isRTL = useIsRTL();
  const [form] = useForm();
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const { t: _t } = useTranslation('convert');
  const isDocumentVisible = useIsDocumentVisible();

  const toCurrencySize = useWatch('toCurrencySize', form);
  const fromCurrencySize = useWatch('fromCurrencySize', form);

  const isLogin = useContextSelector((state) => Boolean(state.user));
  const currenciesMap = useContextSelector((state) => state.currenciesMap);
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const accountType = useSelector((state) => state[NAMESPACE].accountType);
  const formStatus = useSelector((state) => state[NAMESPACE].formStatus);
  const loopDurationTimeUSDD = useSelector((state) => state[NAMESPACE].loopDurationTimeUSDD);
  const kyc3TradeLimitInfo = useSelector((state) => state[NAMESPACE].kyc3TradeLimitInfo);
  const convertSymbolsMap = useConvertSymbolsMap();

  const preQueryPriceParams = useRef({});
  const preKyc3TradeLimitInfo = useRef(null);
  const { run, cancel, onlyCancel, isRunning } = usePolling(
    `${NAMESPACE}/queryPriceForUsddOrder`,
    `${NAMESPACE}/triggerUsddPolling`,
  );

  const [open, setOpen] = useState(false);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [result, setResult] = useState();
  const [priceInfo, setPriceInfo] = useState(null);
  const [estimateFieldName, setEstimateFieldName] = useState('toCurrencySize');
  // const prePair = useRef([fromCurrency, toCurrency]);

  const { currencyName = '' } = currenciesMap[toCurrency] || {};
  const isEmptyForm = [fromCurrencySize, toCurrencySize].every(isNil);
  const isNullSize = [fromCurrencySize, toCurrencySize].every(isNil);
  const { minSize: minQuoteSize } = convertSymbolsMap[fromCurrency] ?? {};

  // 初始化询价状态 & 轮训计时器
  useEffect(() => {
    dispatch({ type: `${NAMESPACE}/resetFormStatus` });
    kcsensorsManualTrack({ spm: ['convertForm', '3'] }, 'expose');
  }, [dispatch]);

  useEffect(() => {
    if (isLogin) {
      return () => {
        cancel();
      };
    }
  }, [isLogin]);
  // 处理网页可见性切换的时候，重启询价轮训的逻辑
  useEffect(() => {
    // isDocumentVisible初始化值为undefined
    if (isDocumentVisible && isRunning) {
      queryPrice();
    } else if (isDocumentVisible === false) {
      onlyCancel();
    }
  }, [isDocumentVisible, queryPrice, onlyCancel]);
  // 关闭kyc3弹窗重启询价
  useEffect(() => {
    if (preKyc3TradeLimitInfo.current && !kyc3TradeLimitInfo) {
      queryPrice();
    }
    return () => {
      preKyc3TradeLimitInfo.current = kyc3TradeLimitInfo;
    };
  }, [kyc3TradeLimitInfo]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    // 币种变更， 清空输入的所有数量
    form.resetFields();
    // if (!isEqualPair([fromCurrency, toCurrency], prePair.current)) {
    //   form.resetFields();
    // }
    // prePair.current = [fromCurrency, toCurrency];
  }, [form, fromCurrency, toCurrency]);

  // 在没输入fromCurrencySize或者toCurrencySize时，也要询价给用户预览
  useEffect(() => {
    if (isLogin && isNullSize && !isNil(minQuoteSize)) {
      queryPrice({
        fromCurrencySize: multiply(minQuoteSize)(100).toFixed(),
      });
    }
  }, [isLogin, isNullSize, minQuoteSize, fromCurrency, toCurrency]);

  const queryPrice = useEventCallback((params, reqId) => {
    // 没传参数使用上一次的参数，比如点击重新询价时
    params = params || preQueryPriceParams.current;
    if (!params || !isLogin || reqId < lastRequestId) return;

    lastRequestId = reqId || lastRequestId + 1;
    // 保存上次询价的数量信息
    preQueryPriceParams.current = params;
    dispatch({ type: `${NAMESPACE}/resetFormStatus` });
    // 获取询价后被影响的数量字段名
    const oppositionFieldName = getOppositionFieldName(params);
    // 获取询价的数量字段名
    const fieldName = ['fromCurrencySize', 'toCurrencySize'].find((v) => v !== oppositionFieldName);
    // 是否空询价
    const isEmptyQuote = [fromCurrencySize, toCurrencySize].every(isNil);
    run(
      {
        ...params,
        requestId: lastRequestId,
        onSuccess: (data, requestId) => {
          // 防止因为异步拉取导致的错误填充, requestId >= lastRequestId实现异步锁
          if (
            requestId < lastRequestId ||
            form.getFieldError(fieldName).length ||
            !has(preQueryPriceParams.current, fieldName)
          )
            return;
          const { size, price, inversePrice, ...other } = data;
          setPriceInfo({
            [`${fromCurrency}-${toCurrency}`]: price,
            [`${toCurrency}-${fromCurrency}`]: inversePrice,
            ...(!isEmptyQuote ? { updateAt: Date.now(), ...other } : null),
          });
          if (!isEmptyQuote && oppositionFieldName) {
            validator[`${oppositionFieldName}Validator`]?.(size, true)
              .then(() => {
                form.setFieldsValue({ [oppositionFieldName]: size });
              })
              .catch((e) => {
                form.setFields([
                  {
                    value: size,
                    name: oppositionFieldName,
                    errors: e?.message ? [e.message] : [],
                  },
                ]);
              });
          }
        },
        onError: (e, requestId) => {
          if (isEmptyQuote || requestId < lastRequestId) return;
          // 429000是询价限频的错误码，此时不需要走询价异常的流程
          if (![429000].includes(e?.code)) {
            cancel();
            dispatch({
              type: `${NAMESPACE}/update`,
              payload: {
                formStatus: getTdErrorMsg(e) || _t('87Nu1G4uF6mm2JAfs1Nqmw'),
              },
            });
          }
        },
      },
      loopDurationTimeUSDD * 1000,
    );
  });
  const { run: debounceQueryPrice, cancel: cancelDebounceQueryPrice } = useDebounceFn(queryPrice, {
    wait: 500,
  });

  const { run: handleSubmit } = useDebounceFn(
    () => {
      // tickerId不存在或者最新拉取的时间>服务端设置的最大过期时间了
      if (!priceInfo?.tickerId || Date.now() - priceInfo.updateAt > MAX_PRICE_EXPIRE_TIME) {
        sentryCaptureEvent({
          tags: { fatal_type: 'queryPriceResultsReport' },
          message: `usdd convert query price error: ${
            priceInfo?.tickerId ? 'expired' : 'no_tickerId'
          }`,
        });
        // 走报价过期逻辑
        dispatch({
          type: `${NAMESPACE}/update`,
          payload: { formStatus: _t('rfcNUC5cf8HvEY96kN1qCo') },
        });
        return;
      }
      cancel();
      const results = {
        pricing_type: 'usdd',
        trade_service_type: 'flash_trade',
        trade_pair: `${fromCurrency}-${toCurrency}`,
      };
      dispatch({
        type: `${NAMESPACE}/confirmUsddOrder`,
        payload: {
          accountType,
          channel: 'WEB_CONVERT',
          tickerId: priceInfo.tickerId,
        },
      })
        .then((res) => {
          if (res?.success) {
            results.is_success = true;
            results.fail_reason = 'none';
            results.fail_reason_code = 'none';
            setResult({
              type: 'success',
              toCurrencySize: res.data.toCurrencySize,
            });
            // 刷新余额
            dispatch({
              type: `${NAMESPACE}/pullUsddPosition`,
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
          setOpen(false);
          kcsensorsManualTrack({ checkID: false, data: results }, 'trade_results');
        });
    },
    { wait: 3000, leading: true, trailing: false },
  );

  const handleOpenConfirmModal = useEventCallback(() => {
    setOpen(true);
    // 手动重置轮训，方便按钮倒计时
    queryPrice();
    kcsensorsManualTrack({ spm: ['usdd', 'placeOrder'] }, 'page_click');
  });

  const handleReverse = useEventCallback(() => {
    // 反转币种后，预估字段名也要跟着反转
    const newEstimateFieldName = getOppositionFieldName({ [estimateFieldName]: 1 });
    setEstimateFieldName(newEstimateFieldName);
  });

  const triggerValidate = useEventCallback((key, val, preVal, isFormChange, isEstimateField) => {
    const setFields = !isFormChange
      ? (e) => {
          form.setFields([
            {
              name: key,
              value: val,
              errors: e?.message ? [e.message] : [],
            },
          ]);
        }
      : noop;
    const newEstimateFieldName = getOppositionFieldName({ [key]: 1 });
    const hasError = form.getFieldError(key).length;
    validator[`${key}Validator`](val, isEstimateField)
      .then(() => {
        setFields();
        if (isNil(val)) {
          cancelDebounceQueryPrice();
          return form.resetFields([newEstimateFieldName]);
        }
        if ((!isFormChange && hasError) || comparedTo(preVal, val) !== 0) {
          lastRequestId += 1;
          debounceQueryPrice({ [key]: val, fromCurrency, toCurrency }, lastRequestId);
        }
      })
      .catch((e) => {
        if (!isEstimateField) {
          cancel();
          cancelDebounceQueryPrice();
          form.resetFields([newEstimateFieldName]);
        }
        setFields(e);
      });
  });

  const onSizeChange = (key, val, preVal) => {
    const newEstimateFieldName = getOppositionFieldName({ [key]: 1 });
    setEstimateFieldName(newEstimateFieldName);
    triggerValidate(key, val, preVal, true, false);
  };

  const toField = useUSDDToField({
    estimateFieldName,
    value: toCurrencySize,
    onChange: (v) => onSizeChange('toCurrencySize', v, toCurrencySize),
  });
  const fromField = useUSDDFromField({
    form,
    triggerValidate,
    estimateFieldName,
    value: fromCurrencySize,
    onChange: (v) => onSizeChange('fromCurrencySize', v, fromCurrencySize),
  });

  return (
    <StyledForm form={form} onFinish={handleOpenConfirmModal} data-inspector="convert_usdd_form">
      <FieldWrapper {...fromField.wrapperProps}>
        <FormItem {...fromField.formItemProps}>
          <InputNumber {...fromField.inputNumberProps} />
        </FormItem>
      </FieldWrapper>
      <UsddSwapButton onClick={handleReverse} />
      <FieldWrapper {...toField.wrapperProps}>
        <FormItem {...toField.formItemProps}>
          <InputNumber {...toField.inputNumberProps} />
        </FormItem>
      </FieldWrapper>
      <EtfAlert />
      {!formStatus && priceInfo && <PriceInfo data={priceInfo} />}
      {Boolean(priceInfo?.tickerId) && (
        <>
          <ConfirmDialog
            open={open}
            onOk={handleSubmit}
            priceInfo={priceInfo}
            onCancel={() => setOpen(false)}
            toCurrencySize={toCurrencySize}
            refreshPrice={() => queryPrice()}
            fromCurrencySize={fromCurrencySize}
          />
          <ResultDialog
            {...result}
            pageType="history"
            onCancel={setResult}
            onOk={result?.type === 'fail' ? queryPrice : onCancel || form.resetFields}
          />
        </>
      )}
      <PriceNotice />
      <ConvertLimit onClick={() => setLimitDialogOpen(true)}>
        <span>{_t('4ea569db75e44000a1e0')}</span>
        {!isRTL ? <ICArrowRightOutlined size="16" /> : <ICArrowLeftOutlined size="16" />}
      </ConvertLimit>
      <UsddLimitDialog
        title={_t('605d8bdb76ef4000a89f')}
        open={limitDialogOpen}
        onOk={() => setLimitDialogOpen(false)}
        onCancel={() => setLimitDialogOpen(false)}
        convertSymbolsMap={convertSymbolsMap}
      />
      <ButtonWrapper style={{ marginTop: sm ? 32 : 28 }} onClick={() => queryPrice()}>
        <SubmitButton>
          {isEmptyForm
            ? _t('7SC1QGsDyKE4WDGPfqJRD9')
            : _t('7RiVCUUeoCzKQZpcsFXEBt', { currency: currencyName })}
        </SubmitButton>
      </ButtonWrapper>
    </StyledForm>
  );
};

export default React.memo(USDDForm);
