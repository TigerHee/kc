/**
 * Owner: garuda@kupotech.com
 * 追加/减少保证金
 */
import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

// import loadable from '@loadable/component';
import { greaterThan } from 'src/utils/operation';
import { _t } from 'utils/lang';

import { gaExpose as trackExposeS, trackClick } from 'src/utils/ga';

import { Tabs as KuxTabs } from '@kux/mui';

import SymbolText from '@/components/SymbolText';

import useIsMobile from '@/hooks/common/useIsMobile';
import { useIsRTL } from '@/hooks/common/useLang';
import { getPositionCalcData } from '@/hooks/futures/useCalcData';
import { useGetAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { getMarkPrice } from '@/hooks/futures/useMarket';
import {
  useOperatorMarginVisible,
  useOperatorMargin,
  useGetWithdrawAvailable,
} from '@/hooks/futures/useOperatorMargin';
import {
  ADJ_MARGIN,
  ADJUST_MARGIN,
  SK_ADD_KEY,
  SK_REDUCER_KEY,
} from '@/meta/futuresSensors/withdraw';
import { styled } from '@/style/emotion';

import AppendMargin from './AppendMargin';
import ReducerMargin from './ReducerMargin';
import { getAdjustProps } from './useAdjustProps';

import { SymbolBox, TradeSideBox, AdaptiveModal } from '../commonStyle';
import { APPEND_TABS, FORMAT_MESSAGE, REDUCER_TABS, WITHDRAW_MARGIN_BLOCK } from '../config';
import { useOperatorMarginTabs } from '../hooks';

const { Tab } = KuxTabs;

// FIXME: 兼容弹框下有滚动条，颜色不对的情况
const getBackground = (isRTL, placement) => {
  const deg = placement === 'left' ? 90 : 270;
  const percent = isRTL ? 10 : 20;
  return `linear-gradient(${deg}deg, #222222 ${percent}%, rgba(34, 34, 34, 0) 100%)`;
};

const StyledTabs = styled(KuxTabs)`
  ${(props) => {
    if (props.theme.currentTheme === 'dark') {
      return `
        .KuxTabs-rightScrollButtonBg {
          background: ${getBackground(props.isRTL)};
        }
        .KuxTabs-leftScrollButtonBg {
          background: ${getBackground(props.isRTL, 'left')};
        }
      `;
    }
  }}
`;

const OperatorMarginDialog = () => {
  const dispatch = useDispatch();
  const { symbol, size } = useGetAppendMarginDetail();
  const { dialogVisible, onChangeVisible, loading } = useOperatorMarginVisible();
  const { postOperatorMargin, getMaxWithdrawMargin } = useOperatorMargin();
  const { activeKey, onChangeTab } = useOperatorMarginTabs();
  const getWithdrawAvailable = useGetWithdrawAvailable();
  const appendRef = useRef();
  const reducerRef = useRef();
  const isRtl = useIsRTL();

  const isLong = useMemo(() => greaterThan(size)(0), [size]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (dialogVisible) {
      getMaxWithdrawMargin(symbol);

      // 曝光-埋点
      trackExposeS(ADJ_MARGIN);
    }
  }, [dialogVisible, getMaxWithdrawMargin, symbol]);

  const handleCloseDialog = useCallback(() => {
    onChangeVisible(false);
  }, [onChangeVisible]);

  const handleConfirm = useCallback(async () => {
    const isAppend = activeKey === APPEND_TABS;
    const formRef = isAppend ? appendRef.current : reducerRef.current;

    if (formRef) {
      const calcData = getPositionCalcData(symbol);
      const markPrice = getMarkPrice(symbol);
      const formValues = await formRef.submit();
      const {
        avgEntryPrice,
        afterEntryPrice,
        liquidationPrice,
        afterLiquidationPrice,
        totalMargin,
        afterMargin,
        leverage,
        afterRealLeverage,
      } = getAdjustProps({
        inputMargin: formValues?.margin,
        type: activeKey,
        isError: false,
        calcData,
        markPrice,
      });
      // 确认按钮点击埋点
      trackClick([ADJUST_MARGIN, '3'], {
        margin1: totalMargin,
        margin2: afterMargin,
        lev1: leverage,
        lev2: afterRealLeverage,
        openPrice1: avgEntryPrice,
        openPrice2: afterEntryPrice,
        liqPrice1: liquidationPrice,
        liqPrice2: afterLiquidationPrice,
        ChooseMargin: formValues?.margin,
        symbol,
        MarginDirection: isAppend ? SK_ADD_KEY : SK_REDUCER_KEY,
      });
      if (formValues?.margin) {
        const data = await postOperatorMargin({
          symbol,
          margin: formValues.margin,
          isAppend,
        });
        if (!data.success) {
          trackClick([ADJUST_MARGIN, '6'], {
            AdjResult: 'failure',
            symbol,
            MarginDirection: isAppend ? SK_ADD_KEY : SK_REDUCER_KEY,
          });
          // 判断是否需要前端 format 消息体，如果报错需要请求一次接口
          if (FORMAT_MESSAGE[data.code]) {
            formRef.setFields([{ name: 'margin', errors: [_t(FORMAT_MESSAGE[data.code])] }]);
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
          handleCloseDialog();
          dispatch({
            type: 'notice/feed',
            payload: {
              type: 'message.success',
              message: isAppend ? _t('append.margin.success') : _t('reducer.margin.success'),
            },
          });
          trackClick([ADJUST_MARGIN, '6'], {
            AdjResult: 'success',
            symbol,
            MarginDirection: isAppend ? SK_ADD_KEY : SK_REDUCER_KEY,
          });
        }
      }
    }
  }, [
    activeKey,
    dispatch,
    getMaxWithdrawMargin,
    getWithdrawAvailable,
    handleCloseDialog,
    postOperatorMargin,
    symbol,
  ]);

  return (
    <AdaptiveModal
      okText={_t('security.form.btn')}
      cancelText={isMobile ? null : _t('trade.confirm.cancel')}
      onOk={handleConfirm}
      open={dialogVisible}
      onClose={handleCloseDialog}
      title={
        <StyledTabs isRtl={isRtl} value={activeKey} onChange={onChangeTab}>
          <Tab value={APPEND_TABS} label={_t('add.margin.title')} />
          <Tab value={REDUCER_TABS} label={_t('reducer.margin.title')} />
        </StyledTabs>
      }
      cancelButtonProps={{
        variant: 'text',
      }}
      okLoading={loading}
      destroyOnClose
      showCancelButton
    >
      <SymbolBox>
        <TradeSideBox isLong={isLong}>{_t(isLong ? 'trade.long' : 'trade.short')}</TradeSideBox>
        <SymbolText boxClassName="symbol-text" symbol={symbol} />
      </SymbolBox>
      {activeKey === APPEND_TABS ? (
        <AppendMargin ref={appendRef} />
      ) : (
        <ReducerMargin ref={reducerRef} />
      )}
    </AdaptiveModal>
  );
};

export default React.memo(OperatorMarginDialog);
