import {useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {getBaseCurrency} from 'site/tenant';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import useLang from 'hooks/useLang';
import {isUndef} from 'utils/helper';
import {
  CopyModePayloadType,
  DEFAULT_LEVERAGE_VALUE,
  FOLLOW_MODE_ENUM,
  LeveragePatternType,
} from '../constant';
import {getIsCancelOrCloseByStatus} from '../presenter/helper';
import {useGetFormSceneStatus} from './useGetFormSceneStatus';
import {useOptimizeFormDefaultValues} from './useOptimizeFormDefaultValues';
import {usePullCopyFormConfig} from './usePullCopyFormConfig';
import {useRewriteFormDetail} from './useRewriteFormDetail';

export const useInitForm = ({availableBalance, tabValue}) => {
  const {_t} = useLang();
  const {isReadonly} = useGetFormSceneStatus();

  const {data: configInfo} = useRewriteFormDetail();
  const {copyMode, status} = configInfo || {};
  const isShowFixedRateForm = useMemo(
    () => copyMode === CopyModePayloadType.fixedRate,
    [copyMode],
  );

  const isFixedAmountMode = useMemo(
    () =>
      isReadonly
        ? !isShowFixedRateForm
        : tabValue === FOLLOW_MODE_ENUM.fixedAmount,
    [isReadonly, isShowFixedRateForm, tabValue],
  );
  const {data: formConfigResp} = usePullCopyFormConfig();

  const schema = useMemo(() => {
    const {
      maxCostPreCopyOrder,
      maxCopyAmount,
      minCostPerCopyOrder,
      minCopyAmount,
    } = formConfigResp?.data || {};
    if (isReadonly || !Object.keys(formConfigResp?.data || {}).length) {
      return yup.object();
    }
    return yup.object().shape({
      copyLeadAddMargin: yup.boolean(),
      leverage: yup.number().required('Leverage is required'),
      leveragePattern: yup
        .string()
        .oneOf(['FOLLOW', 'FIX'], 'Invalid leverage pattern')
        .required('Leverage pattern is required'),
      maxAmount: yup
        .number()
        .typeError(_t('2c11d62d7fe14000ab28'))
        .required(_t('2c11d62d7fe14000ab28'))
        .test('maxAmount', _t('6eb65c32ae6d4000ae78'), function (value) {
          return value <= availableBalance;
        })
        .test('perAmount', _t('6d15d0eb3be64000a364'), function (value) {
          return (
            isUndef(this.parent.perAmount) || value >= this.parent.perAmount
          );
        })
        .test(
          'maxAmount',
          _t('6a5370fde3c74000a157', {
            min: minCopyAmount,
            max: maxCopyAmount,
          }),
          function (value) {
            return value >= minCopyAmount && value <= maxCopyAmount;
          },
        ),
      perAmount: !isFixedAmountMode
        ? yup.number().notRequired()
        : yup
            .number()
            .typeError(_t('ad9bbe8f358b4000a31b'))
            .required(_t('ad9bbe8f358b4000a31b'))
            .test(
              'perAmount',
              _t('694e368269b64000a221', {
                amount: maxCostPreCopyOrder,
                symbol: getBaseCurrency(),
              }),
              function (value) {
                return value <= this.parent.maxAmount;
              },
            )
            .test(
              'perAmount',
              _t('694e368269b64000a221', {
                amount: minCostPerCopyOrder,
                symbol: getBaseCurrency(),
              }),
              function (value) {
                return value >= minCostPerCopyOrder;
              },
            ),
    });
  }, [
    _t,
    availableBalance,
    formConfigResp?.data,
    isFixedAmountMode,
    isReadonly,
  ]);

  const fixedAmountFormMethods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      leverage: DEFAULT_LEVERAGE_VALUE,
      leveragePattern: LeveragePatternType.FOLLOW,
      copyLeadAddMargin: true,
    },
  });

  const fixedRateFormMethods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      leverage: DEFAULT_LEVERAGE_VALUE,
      leveragePattern: LeveragePatternType.FOLLOW,
      copyLeadAddMargin: true,
    },
  });

  const formMethods = useMemo(() => {
    return isFixedAmountMode ? fixedAmountFormMethods : fixedRateFormMethods;
  }, [fixedRateFormMethods, isFixedAmountMode, fixedAmountFormMethods]);

  const isSubmitDisabled = useMemo(
    () => !formMethods.formState?.isValid,
    [formMethods.formState],
  );

  /// 适配 表单默认值与动态配置冲突 */
  useOptimizeFormDefaultValues({fixedAmountFormMethods, fixedRateFormMethods});

  return {
    isSubmitDisabled,
    handleSubmit: formMethods.handleSubmit,
    fixedAmountFormMethods,
    fixedRateFormMethods,
    reset: formMethods.reset,
    isCancelOrClose: isReadonly && getIsCancelOrCloseByStatus(status),
  };
};
