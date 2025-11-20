/**
 * Owner: garuda@kupotech.com
 * 调整真实杠杆
 */
import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { gaExpose as trackExposeS, trackClick } from 'src/utils/ga';
import { ADJ_LEVERAGE, ADJUST_LEVERAGE } from '@/meta/futuresSensors/withdraw';

import { _t } from 'utils/lang';
import { greaterThan, lessThan, lessThanOrEqualTo, abs } from 'utils/operation';

import useIsMobile from '@/hooks/common/useIsMobile';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
import { useGetAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { useMarkPrice } from '@/hooks/futures/useMarket';
import {
  useChangeRealLeverageVisible,
  useOperatorMargin,
  useGetWithdrawAvailable,
} from '@/hooks/futures/useOperatorMargin';
import { styled } from '@/style/emotion';
import { formatNumber } from '@/utils/futures';

import AdjustCard from './AdjustCard';
import AlertBox from './AlertBox';
import CurrentLeverage from './CurrentLeverage';
import LeverageForm from './LeverageForm';
import LimitLeverage from './LimitLeverage';
import SliderLeverage from './SliderLeverage';
import Title from './Title';
import { getAdjustProps } from './useAdjustProps';
import useLeverageProps from './useLeverageProps';

import { AdaptiveModal } from '../commonStyle';
import { FORMAT_MESSAGE_LEVERAGE, WITHDRAW_MARGIN_BLOCK } from '../config';
import { useMinimumPrecision } from '../hooks';

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
    .symbol-wrapper {
      margin-bottom: 0;
    }
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .rc-slider {
    width: 96%;
    margin: 10px auto 0;
    .rc-slider-tooltip {
      /* @noflip */
      right: initial;
    }
    .rc-slider-handle {
      background: ${(props) => props.theme.colors.layer};
    }
    .rc-slider-tooltip-content {
      .rc-slider-tooltip-inner {
        padding: 0 4px;
      }
    }
    &.rc-slider-disabled {
      .rc-slider-handle {
        border-color: ${(props) => props.theme.colors.divider8} !important;
      }
    }
  }
`;

const ChangeRealLeverageDialog = () => {
  const dispatch = useDispatch();

  const isMobile = useIsMobile();
  // 获取当前仓位值
  const { symbol, leverage, settleCurrency } = useGetAppendMarginDetail();

  const { dialogVisible, onChangeVisible, loading } = useChangeRealLeverageVisible();
  const { postOperatorMargin, getMaxWithdrawMargin } = useOperatorMargin();
  const { disabled, minLeverage, maxLeverage, realLeverage } = useLeverageProps();
  const getWithdrawAvailable = useGetWithdrawAvailable();

  const markPrice = useMarkPrice(symbol);

  const [innerValue, setInnerValue] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  // 获取计算后的值
  const calcData = useGetPositionCalcData(symbol);

  // 当前的总保证金
  // const totalMargin = calcData?.totalMargin || margin;

  // 当前的最小金额
  const { minimumMargin, precision } = useMinimumPrecision(settleCurrency, symbol);

  // 杠杆取值，四舍五入，tips: 这里故意不取计算值，用作表单值的初始化，防止表单杠杆初始化值一直变动
  const currentLeverage = formatNumber(leverage, { fixed: 2, pointed: false });

  // 弹框隐藏重置 innerValue
  useEffect(() => {
    // 弹框曝光-埋点
    if (dialogVisible) {
      trackExposeS(ADJ_LEVERAGE);
    }
    // 关闭弹框重置输入值
    if (!dialogVisible) {
      setInnerValue(undefined);
    }
  }, [dialogVisible]);

  // 仓位杠杆变化
  useEffect(() => {
    if (dialogVisible) {
      setInnerValue(currentLeverage);
    }
  }, [currentLeverage, dialogVisible]);

  // 判断当前杠杆是否超过最大杠杆
  useEffect(() => {
    if (dialogVisible && innerValue !== undefined && lessThan(minLeverage)(maxLeverage)) {
      if (lessThan(innerValue)(minLeverage)) {
        setInnerValue(minLeverage);
        setIsFocus(true);
        // 埋点 TIPS: 这里不埋点，手动操作才埋
        trackClick([ADJUST_LEVERAGE, '8']);
      } else if (greaterThan(innerValue)(maxLeverage)) {
        setInnerValue(maxLeverage);
        setIsFocus(true);
        // 埋点 TIPS: 这里不埋点，手动操作才埋
        trackClick([ADJUST_LEVERAGE, '8']);
      }
    }
  }, [dialogVisible, innerValue, maxLeverage, minLeverage]);

  // 打开 dialog 请求一次接口
  useEffect(() => {
    if (dialogVisible) {
      getMaxWithdrawMargin(symbol);
    }
  }, [dialogVisible, getMaxWithdrawMargin, symbol]);

  const handleCloseDialog = useCallback(() => {
    onChangeVisible(false);
  }, [onChangeVisible]);

  const onLeverageChange = useCallback(
    (value) => {
      if (lessThan(+value)(minLeverage)) {
        setInnerValue(minLeverage);
        setIsFocus(true);
        // 埋点
        trackClick([ADJUST_LEVERAGE, '8']);
      } else if (greaterThan(+value)(maxLeverage)) {
        setInnerValue(maxLeverage);
        setIsFocus(true);
        // 埋点
        trackClick([ADJUST_LEVERAGE, '8']);
      } else {
        setInnerValue(value);
      }
    },
    [maxLeverage, minLeverage],
  );

  const handleConfirm = useCallback(async () => {
    const {
      inputMargin: calcMargin = 0,
      afterMargin,
      avgEntryPrice,
      afterEntryPrice,
      totalMargin,
      liquidationPrice,
      afterLiquidationPrice,
      leverage: prevLeverage,
    } = getAdjustProps({
      leverage: innerValue,
      isError,
      calcData,
      markPrice,
    });
    const isAppend = lessThanOrEqualTo(calcMargin || 0)(0);
    // 确认按钮点击埋点
    trackClick([ADJUST_LEVERAGE, '6'], {
      margin1: totalMargin,
      margin2: afterMargin,
      lev1: prevLeverage,
      lev2: innerValue,
      openPrice1: avgEntryPrice,
      openPrice2: afterEntryPrice,
      liqPrice1: liquidationPrice,
      liqPrice2: afterLiquidationPrice,
      ChooseLev: innerValue,
      symbol,
    });
    if (isError) return;
    if (!+calcMargin || lessThan(abs(calcMargin))(minimumMargin)) {
      setIsError(_t('leverage.operator.block'));
      return;
    }
    if (+calcMargin) {
      const data = await postOperatorMargin({
        symbol,
        margin: abs(
          formatNumber(calcMargin, {
            fixed: precision,
            pointed: false,
          }),
        ),
        isAppend,
      });
      if (!data.success) {
        trackClick([ADJUST_LEVERAGE, '7'], {
          AdjResult: 'failure',
          symbol,
        });
        // 判断是否需要前端 format 消息体，如果报错需要请求一次接口
        if (FORMAT_MESSAGE_LEVERAGE[data.code]) {
          setIsError(_t(FORMAT_MESSAGE_LEVERAGE[data.code]));
          getMaxWithdrawMargin(symbol);
          return;
        }
        // 如果是灰度报错，直接关闭弹框，再请求一次接口
        if (WITHDRAW_MARGIN_BLOCK === data.code) {
          handleCloseDialog();
          getWithdrawAvailable();
          dispatch({
            type: 'notice/feed',
            payload: {
              type: 'message.error',
              message: _t('grayscale.tips'),
            },
          });
          return;
        }
        handleCloseDialog();
        dispatch({
          type: 'notice/feed',
          payload: {
            type: 'message.error',
            message: data.msg,
          },
        });
        return;
      }
      if (data.success) {
        setIsError(false);
        handleCloseDialog();
        dispatch({
          type: 'notice/feed',
          payload: {
            type: 'message.success',
            message: _t('leverage.operator.success'),
          },
        });
        trackClick([ADJUST_LEVERAGE, '7'], {
          AdjResult: 'success',
          symbol,
        });
      }
    }
  }, [
    calcData,
    dispatch,
    getMaxWithdrawMargin,
    getWithdrawAvailable,
    handleCloseDialog,
    innerValue,
    isError,
    markPrice,
    minimumMargin,
    postOperatorMargin,
    precision,
    symbol,
  ]);

  return (
    <AdaptiveModalWrapper
      okText={_t('security.form.btn')}
      cancelText={isMobile ? null : _t('trade.confirm.cancel')}
      onOk={handleConfirm}
      open={dialogVisible}
      onClose={handleCloseDialog}
      cancelButtonProps={{
        variant: 'text',
      }}
      title={<Title />}
      okLoading={loading}
      destroyOnClose
      showCancelButton
    >
      <ContentWrapper>
        <CurrentLeverage realLeverage={realLeverage} />
        <LeverageForm
          onLeverageChange={onLeverageChange}
          minLeverage={minLeverage}
          maxLeverage={maxLeverage}
          disabled={disabled}
          leverage={innerValue}
          onError={setIsError}
        />
        <LimitLeverage
          isFocus={isFocus}
          minLeverage={minLeverage}
          maxLeverage={maxLeverage}
          disabled={disabled}
        />
        <SliderLeverage
          symbol={symbol}
          onLeverageChange={onLeverageChange}
          minLeverage={minLeverage}
          maxLeverage={maxLeverage}
          disabled={disabled}
          leverage={innerValue}
          onSetWarning={setIsFocus}
        />
        <AlertBox isError={isError} leverage={innerValue} />
        <AdjustCard isError={isError} leverage={innerValue} disabled={disabled} />
      </ContentWrapper>
    </AdaptiveModalWrapper>
  );
};

export default React.memo(ChangeRealLeverageDialog);
