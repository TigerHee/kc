/**
 * Owner: garuda@kupotech.com
 * 调整杠杆的弹框
 */

import React, { useState, useCallback, useEffect } from 'react';

import { siteCfg } from 'config';
import { isUndefined } from 'lodash';

import SafeLink from 'src/components/SafeLink';
import { trackClick } from 'utils/ga';
import { greaterThan, lessThanOrEqualTo } from 'utils/operation';

import { ICArrowRightOutlined } from '@kux/icons';

import NumberTextField from '@/components/NumberInput';
import { useSwitchTrialFund } from '@/hooks/futures/useFuturesTrialFund';
import { useGetMaxLeverage, useGetLeverage, useLeverageDialog } from '@/hooks/futures/useLeverage';
import { MARGIN_MODE_ISOLATED } from '@/meta/futures';
import { SENSORS_MARGIN_TYPE, tradeLev } from '@/meta/futuresSensors/trade';
import { _t, addLangToPath } from '@/pages/Futures/import';

import MaxOpenTip from './MaxOpenTip';

import { AdaptiveModal, IsolatedLeverageTips, Slider } from '../commonStyle';
import { LEVERAGE_MIN, LEVERAGE_STEP, TOOL_STEP } from '../config';
import KycAlertInfo from '../KycAlertInfo';
import LeverageAlertRisk from '../LeverageAlertRisk';

import { sliderMarks } from '../utils';


const IsolatedLeverageDialog = ({ open, symbol, onClose }) => {
  const [error, setError] = useState(null);
  const [innerValue, setInnerValue] = useState(LEVERAGE_MIN);
  const leverage = useGetLeverage({ symbol, marginMode: MARGIN_MODE_ISOLATED });
  const { onIsolatedLeverageSubmit } = useLeverageDialog();
  const { switchTrialFund } = useSwitchTrialFund();
  const maxLeverage = useGetMaxLeverage({
    symbol,
    switchTrialFund,
    marginMode: MARGIN_MODE_ISOLATED,
    isUser: true,
  });

  const leverageValidator = useCallback(
    (v) => {
      if (!v) {
        return _t('order.lev.message');
      }

      if (lessThanOrEqualTo(v)(0)) {
        return _t('trade.lev.value.checked2');
      }

      if (greaterThan(v)(maxLeverage)) {
        return _t('trade.lev.value.checked3', { amount: maxLeverage });
      }

      return null;
    },
    [maxLeverage],
  );

  const handleOk = useCallback(() => {
    if (error) return;
    onIsolatedLeverageSubmit({ leverage: innerValue, symbol });
    onClose();
  }, [error, innerValue, onClose, onIsolatedLeverageSubmit, symbol]);

  const handleInnerValueChange = useCallback(
    (v) => {
      const err = leverageValidator(v);
      setError(err);
      setInnerValue(v);
      // 埋点
      trackClick([tradeLev, '1'], { marginType: SENSORS_MARGIN_TYPE[MARGIN_MODE_ISOLATED] });
    },
    [leverageValidator],
  );

  // 组件渲染的时候，设置一次杠杆值
  useEffect(() => {
    if (open) {
      handleInnerValueChange(leverage);
    }
  }, [handleInnerValueChange, leverage, open]);

  return (
    <AdaptiveModal
      title={_t('leverage.setting')}
      open={open}
      onCancel={onClose}
      cancelText={_t('cancel')}
      okText={_t('security.form.btn')}
      onOk={handleOk}
    >
      <KycAlertInfo
        open={open}
        symbol={symbol}
        marginMode={MARGIN_MODE_ISOLATED}
        userMaxLeverage={maxLeverage}
      />
      <NumberTextField
        min={LEVERAGE_MIN}
        max={maxLeverage}
        value={innerValue}
        onChange={handleInnerValueChange}
        error={!!error}
        helperText={error}
        autoComplete="off"
        step={LEVERAGE_STEP}
        autoFixPrecision
        useTool
        addOrSubStep={TOOL_STEP}
      />
      <Slider
        disabled={isUndefined(leverage)}
        marks={sliderMarks(maxLeverage)}
        min={TOOL_STEP}
        max={maxLeverage}
        value={Number(innerValue)}
        onChange={handleInnerValueChange}
        step={TOOL_STEP}
      />
      {!switchTrialFund ? <MaxOpenTip leverage={innerValue} symbol={symbol} /> : null}
      <LeverageAlertRisk leverage={innerValue} open={open} />
      <IsolatedLeverageTips>
        <SafeLink href={addLangToPath(`${siteCfg.MAINSITE_HOST}/support/26693511734809`)}>
          {_t('futures.view.riskLimit')}
        </SafeLink>
        <ICArrowRightOutlined />
      </IsolatedLeverageTips>
    </AdaptiveModal>
  );
};

export default React.memo(IsolatedLeverageDialog);
