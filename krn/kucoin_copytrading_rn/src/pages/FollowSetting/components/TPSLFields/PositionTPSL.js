import {useGetFormSceneStatus} from 'pages/FollowSetting/hooks/useGetFormSceneStatus';
import {useRewriteFormDetail} from 'pages/FollowSetting/hooks/useRewriteFormDetail';
import {getIsCancelOrCloseByStatus} from 'pages/FollowSetting/presenter/helper';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useController, useFormContext} from 'react-hook-form';
import {css} from '@emotion/native';
import {RichLocale} from '@krn/ui';

import Switch from 'components/Common/Switch';
import {Percent} from 'components/Common/UpOrDownNumber';
import {BetweenWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {isUndef} from 'utils/helper';
import {dividedBy, greaterThan, lessThan, multiply} from 'utils/operation';
import AdvanceLabel from '../AdvanceLabel';
import RatioInput from './components/RatioInput';
import {useSyncFieldExistErrors} from './hooks/useSyncFieldExistErrors';
import {CAN_SET_SL_LIMIT_MAP, CAN_SET_TP_LIMIT_MAP} from './constant';
import {ErrorTipText, InputTipText, TPSLFormFieldWrap} from './index.styles';
import {useSwitchCheckManage} from './useSwitchCheckManage';

export const PositionTPSL = () => {
  const {_t} = useLang();

  const [errors, setErrors] = useState({
    stopLossRatio: '',
    takeProfitRatio: '',
  });
  const [predictTips, setPredictTips] = useState({
    stopLossRatio: '',
    takeProfitRatio: '',
  });
  const {data: configInfo} = useRewriteFormDetail();
  const {isReadonly} = useGetFormSceneStatus();
  // 编辑模式时 是否为取消或者关闭状态
  const isCancelOrClose = useMemo(
    () => isReadonly && getIsCancelOrCloseByStatus(configInfo?.status),
    [configInfo?.status, isReadonly],
  );

  const {control} = useFormContext();

  const controller = useController({
    name: 'PositionStopTake',
    control,
    defaultValue: {stopLossRatio: '', takeProfitRatio: ''},
  });

  const {
    field: {onChange, value},
  } = controller;

  useSyncFieldExistErrors({errors, onChange, value});
  const {isCheckSwitch, onChangeSwitch} = useSwitchCheckManage({
    isProjectField: false,
    onChange,
  });
  // 校验规则生成器
  const getValidationRules = useCallback(
    formValue => {
      const errors = {};
      const predictTips = {};

      const {stopLossRatio, takeProfitRatio} = formValue || value || {};

      /* 规则1校验 */
      // 止盈校验
      if (!isUndef(takeProfitRatio)) {
        if (
          lessThan(+takeProfitRatio)(CAN_SET_TP_LIMIT_MAP.min) ||
          greaterThan(+takeProfitRatio)(CAN_SET_TP_LIMIT_MAP.max)
        ) {
          errors.takeProfitRatio = _t('ae11eb7de8104000a95a', {
            '1_num': CAN_SET_TP_LIMIT_MAP.min,
            '2_num': CAN_SET_TP_LIMIT_MAP.max,
          });
        }
      }

      // 止损校验
      if (!isUndef(stopLossRatio)) {
        if (
          lessThan(+stopLossRatio)(CAN_SET_SL_LIMIT_MAP.min) ||
          greaterThan(+stopLossRatio)(CAN_SET_SL_LIMIT_MAP.max)
        ) {
          errors.stopLossRatio = _t('ae11eb7de8104000a95a', {
            '1_num': CAN_SET_SL_LIMIT_MAP.min,
            '2_num': CAN_SET_SL_LIMIT_MAP.max,
          });
        }
      }

      if (!errors.takeProfitRatio && takeProfitRatio) {
        predictTips.takeProfitRatio = dividedBy(takeProfitRatio)(100);
      }
      if (!errors.stopLossRatio && stopLossRatio) {
        predictTips.stopLossRatio = multiply(dividedBy(stopLossRatio)(100))(-1);
      }
      setErrors(errors);
      setPredictTips(predictTips);
    },
    [value, _t],
  );

  useEffect(() => {
    getValidationRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckSwitch, configInfo]);

  // 处理 stopLossRatio 输入变化
  const handleStopLossChange = textVal => {
    const newValue = {
      ...value, // 保留现有值
      stopLossRatio: textVal,
    };
    onChange(newValue);
    getValidationRules(newValue);
  };

  // 处理 takeProfitRatio 输入变化
  const handleTakeProfitChange = textVal => {
    const newValue = {
      ...value, // 保留现有值
      takeProfitRatio: textVal,
    };
    onChange(newValue);
    getValidationRules(newValue);
  };

  return (
    <TPSLFormFieldWrap>
      <BetweenWrap>
        <AdvanceLabel
          text={_t('62d75c98d2f04000a095')}
          message={_t('c00ecc5020c64000a000')}
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
              disabled={isCancelOrClose}
            />

            <RatioInput
              isRight
              label={_t('60f8586a8e024000adda')}
              value={value?.stopLossRatio || ''}
              onChange={handleStopLossChange}
              disabled={isCancelOrClose}
            />
          </BetweenWrap>

          {!!errors?.takeProfitRatio && (
            <ErrorTipText>{errors?.takeProfitRatio}</ErrorTipText>
          )}
          {!!Object.keys(predictTips || {})?.length && (
            <>
              {!!(value?.takeProfitRatio && value?.stopLossRatio) && (
                <InputTipText>
                  <RichLocale
                    message={_t('e4bf220c8ab54000a8c0', {
                      '1_num': predictTips.takeProfitRatio || '',
                      '2_num': predictTips.stopLossRatio || '',
                    })}
                    renderParams={{
                      LOSSRATE: {
                        component: Percent,
                      },
                      PROFITRATE: {
                        component: Percent,
                      },
                    }}
                  />
                </InputTipText>
              )}

              {!!(value?.takeProfitRatio && !value?.stopLossRatio) && (
                <InputTipText>
                  <RichLocale
                    message={_t('f9ef69c90e0f4000a1d5', {
                      '1_num': predictTips.takeProfitRatio || '',
                    })}
                    renderParams={{
                      PROFITRATE: {
                        component: Percent,
                      },
                    }}
                  />
                </InputTipText>
              )}

              {!!(!value?.takeProfitRatio && value?.stopLossRatio) && (
                <InputTipText>
                  <RichLocale
                    message={_t('0c9b2e238eb34000ad56', {
                      '1_num': predictTips.stopLossRatio || '',
                    })}
                    renderParams={{
                      LOSSRATE: {
                        component: Percent,
                      },
                    }}
                  />
                </InputTipText>
              )}
            </>
          )}

          {!!errors?.stopLossRatio && (
            <ErrorTipText>{errors?.stopLossRatio}</ErrorTipText>
          )}
        </>
      )}
    </TPSLFormFieldWrap>
  );
};
