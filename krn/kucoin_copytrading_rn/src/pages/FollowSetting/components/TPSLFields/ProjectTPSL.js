import {useGetFormSceneStatus} from 'pages/FollowSetting/hooks/useGetFormSceneStatus';
import {useRewriteFormDetail} from 'pages/FollowSetting/hooks/useRewriteFormDetail';
import {getIsCancelOrCloseByStatus} from 'pages/FollowSetting/presenter/helper';
import React, {memo, useMemo} from 'react';
import {useController, useFormContext} from 'react-hook-form';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {RichLocale} from '@krn/ui';

import Switch from 'components/Common/Switch';
import {Number} from 'components/Common/UpOrDownNumber';
import {BetweenWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import AdvanceLabel from '../AdvanceLabel';
import RatioInput from './components/RatioInput';
import {useProjectTPSLValidate} from './hooks/useProjectTPSLValidate';
import {ErrorTipText, InputTipText, TPSLFormFieldWrap} from './index.styles';
import {useSwitchCheckManage} from './useSwitchCheckManage';

export const ProjectTPSL = memo(() => {
  const {_t} = useLang();
  const afterText = getBaseCurrency();

  const {control} = useFormContext();

  const controller = useController({
    name: 'AccountStopTake',
    control,
    defaultValue: {stopLossRatio: '', takeProfitRatio: ''},
  });

  const {
    field: {onChange, value},
  } = controller;

  const {isCheckSwitch, onChangeSwitch} = useSwitchCheckManage({
    isProjectField: true,
    onChange,
  });
  const {data: configInfo} = useRewriteFormDetail();

  const {isReadonly} = useGetFormSceneStatus();
  // 编辑模式时 是否为取消或者关闭状态
  const isCancelOrClose = useMemo(
    () => isReadonly && getIsCancelOrCloseByStatus(configInfo?.status),
    [configInfo?.status, isReadonly],
  );
  const {validateValue, predictTips, errors, isCopyAmountZeroOrNegative} =
    useProjectTPSLValidate({
      isCheckSwitch,
      value,
      onChange,
      configInfo,
    });

  // 处理 stopLossRatio
  const handleStopLossChange = textVal => {
    const newValue = {
      ...value, // 保留现有值
      stopLossRatio: textVal,
    };
    onChange(newValue);
    validateValue(newValue);
  };

  // 处理 takeProfitRatio 输入
  const handleTakeProfitChange = textVal => {
    const newValue = {
      ...value,
      takeProfitRatio: textVal,
    };
    onChange(newValue);
    validateValue(newValue);
  };

  return (
    <TPSLFormFieldWrap>
      <BetweenWrap>
        <AdvanceLabel
          text={_t('fafe8e8e08624000a555')}
          message={_t('d9979a627cd94000a3c1')}
        />
        <Switch
          disabled={isCancelOrClose}
          checked={isCheckSwitch}
          onChange={onChangeSwitch}
        />
      </BetweenWrap>

      {isCheckSwitch && (
        <>
          <BetweenWrap
            style={css`
              margin-top: 8px;
            `}>
            <RatioInput
              label={_t('97e52470aeca4000a436')}
              value={value?.takeProfitRatio || ''}
              onChange={handleTakeProfitChange}
              disabled={isCopyAmountZeroOrNegative || isCancelOrClose}
            />

            <RatioInput
              isRight
              label={_t('60f8586a8e024000adda')}
              value={value?.stopLossRatio || ''}
              onChange={handleStopLossChange}
              disabled={isCopyAmountZeroOrNegative || isCancelOrClose}
            />
          </BetweenWrap>

          {!!errors?.takeProfitRatio && (
            <ErrorTipText>{errors?.takeProfitRatio}</ErrorTipText>
          )}

          {!!predictTips.takeProfitRatio && (
            <InputTipText>
              <RichLocale
                message={_t('e8d246f727d64000a3a8', {
                  amount: predictTips.takeProfitRatio?.depositAmount,
                  symbol: getBaseCurrency(),
                })}
                renderParams={{
                  AMOUNT: {
                    component: Number,
                    afterText,
                    componentProps: {
                      hiddenPositiveChar: true,
                    },
                  },
                  PREDICTAMOUNT: {
                    component: Number,
                    componentProps: {
                      isProfitNumber: true,
                      afterText,
                      hiddenPositiveChar: false,
                    },
                  },
                }}
              />
            </InputTipText>
          )}
          {!!errors?.stopLossRatio && (
            <ErrorTipText>{errors?.stopLossRatio}</ErrorTipText>
          )}
          {!!predictTips.stopLossRatio && (
            <InputTipText>
              <RichLocale
                message={_t('e8d246f727d64000a3a8', {
                  amount: predictTips.stopLossRatio?.depositAmount,
                  symbol: getBaseCurrency(),
                })}
                renderParams={{
                  AMOUNT: {
                    component: Number,
                    componentProps: {
                      hiddenPositiveChar: true,
                      afterText,
                    },
                  },
                  PREDICTAMOUNT: {
                    component: Number,
                    componentProps: {
                      afterText,
                      isProfitNumber: true,
                      hiddenPositiveChar: false,
                    },
                  },
                }}
              />
            </InputTipText>
          )}
        </>
      )}
    </TPSLFormFieldWrap>
  );
});
