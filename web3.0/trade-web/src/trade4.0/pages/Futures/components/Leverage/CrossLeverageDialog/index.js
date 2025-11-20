/**
 * Owner: garuda@kupotech.com
 * 调整杠杆
 * 这里有可能会出现 杠杆跟最大杠杆不一致的情况，目前不能做限制
 */
import React, { useEffect, useCallback, useState } from 'react';

import { isUndefined } from 'lodash';

import { SENSORS_MARGIN_TYPE, tradeLev } from 'src/trade4.0/meta/futuresSensors/trade';
import { trackClick } from 'utils/ga';
import { greaterThan, lessThan } from 'utils/operation';

import { useGetMaxLeverage, useGetLeverage, useLeverageDialog } from '@/hooks/futures/useLeverage';
import { MARGIN_MODE_CROSS } from '@/meta/futures';
import { styled, _t } from '@/pages/Futures/import';

import AlertBox from './AlertBox';
import CurrentLeverage from './CurrentLeverage';
import LeverageForm from './LeverageForm';
import MarginBox from './MarginBox';
import Title from './Title';

import { AdaptiveModal, Slider } from '../commonStyle';
import { LEVERAGE_MIN, LEVERAGE_STEP, TOOL_STEP } from '../config';

import KycAlertInfo from '../KycAlertInfo';
import LeverageAlertRisk from '../LeverageAlertRisk';

import { sliderMarks } from '../utils';

const AdaptiveModalWrapper = styled(AdaptiveModal)`
  .KuxDialog-body {
    .KuxModalHeader-root {
      border-bottom: none;
      .KuxModalHeader-close {
        top: 32px;
      }
    }
    .KuxDialog-content {
      padding-top: 0;
    }
  }
  &.KuxDrawer-root {
    .KuxModalHeader-root {
      height: auto;
      padding: 16px;
    }
    .symbol-box {
      margin-bottom: 0;
    }
  }
  .KuxButton-text {
    color: ${(props) => props.theme.colors.text60};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CrossLeverageDialog = ({ open, symbol, onClose }) => {
  const [innerValue, setInnerValue] = useState(LEVERAGE_MIN);
  const [isError, setIsError] = useState(false);

  const currentLeverage = useGetLeverage({ symbol, marginMode: MARGIN_MODE_CROSS });
  const maxLeverage = useGetMaxLeverage({
    symbol,
    marginMode: MARGIN_MODE_CROSS,
    isUser: true,
  });
  const { onCrossLeverageSubmit, getV2UserMaxLeverage } = useLeverageDialog();

  const onLeverageChange = useCallback(
    (value) => {
      if (lessThan(+value)(LEVERAGE_MIN)) {
        setInnerValue(LEVERAGE_MIN);
      } else if (greaterThan(+value)(maxLeverage)) {
        setInnerValue(maxLeverage);
      } else {
        setInnerValue(value);
      }
      // 埋点
      trackClick([tradeLev, '1'], { marginType: SENSORS_MARGIN_TYPE[MARGIN_MODE_CROSS] });
    },
    [maxLeverage],
  );

  const handleConfirm = useCallback(async () => {
    if (isError) return;
    onCrossLeverageSubmit({ leverage: innerValue, symbol });
    onClose();
  }, [innerValue, isError, onClose, onCrossLeverageSubmit, symbol]);

  // 仓位杠杆变化
  useEffect(() => {
    if (open) {
      setInnerValue(currentLeverage);
      getV2UserMaxLeverage(symbol);
    }
  }, [currentLeverage, getV2UserMaxLeverage, open, symbol]);

  return (
    <AdaptiveModalWrapper
      okText={_t('security.form.btn')}
      cancelText={_t('trade.confirm.cancel')}
      onOk={handleConfirm}
      open={open}
      onClose={onClose}
      title={<Title />}
      // okLoading={loading}
      destroyOnClose
      showCancelButton
    >
      <ContentWrapper>
        <CurrentLeverage leverage={currentLeverage} />
        <LeverageForm
          onLeverageChange={onLeverageChange}
          minLeverage={LEVERAGE_MIN}
          maxLeverage={maxLeverage}
          // disabled={disabled}
          leverage={innerValue}
          onError={setIsError}
          step={LEVERAGE_STEP}
        />
        <Slider
          disabled={isUndefined(innerValue)}
          marks={sliderMarks(maxLeverage)}
          min={TOOL_STEP}
          max={maxLeverage}
          value={Number(innerValue)}
          onChange={onLeverageChange}
          step={TOOL_STEP}
        />
        <MarginBox symbol={symbol} currentLeverage={currentLeverage} leverage={innerValue} />
        <AlertBox isError={isError} />
        <KycAlertInfo
          open={open}
          symbol={symbol}
          marginMode={MARGIN_MODE_CROSS}
          userMaxLeverage={maxLeverage}
        />
        <LeverageAlertRisk leverage={innerValue} open={open} />
      </ContentWrapper>
    </AdaptiveModalWrapper>
  );
};

export default React.memo(CrossLeverageDialog);
