import {useMemoizedFn} from 'ahooks';
import {useMemo} from 'react';
import {copyTradingBridge} from '@krn/bridge';
import * as Sentry from '@sentry/react-native';

export const usePositionHandler = ({
  extendPositionResponse,
  positionBelongToSubUid: subUid,
  onPressCallback,
}) => {
  const {requestFutureMarketClosePosition, requestFuturePositionTpSl} =
    copyTradingBridge;
  const formatPositionParams = useMemo(() => {
    return JSON.stringify({
      ...(extendPositionResponse || {}),
      subUid,
    });
  }, [extendPositionResponse, subUid]);

  const openClosePosition = useMemoizedFn(async () => {
    try {
      const isSuccess = await requestFutureMarketClosePosition(
        String(subUid),
        formatPositionParams,
      );
      if (isSuccess) {
        onPressCallback?.();
      }
    } catch (error) {
      Sentry.captureEvent({
        message: 'usePositionHandler-openClosePosition-error',
        tags: {error},
      });
    }
  });

  const openTpSl = useMemoizedFn(async () => {
    try {
      const isSuccess = await requestFuturePositionTpSl(
        String(subUid),
        formatPositionParams,
      );
      if (isSuccess) {
        onPressCallback?.();
      }
    } catch (error) {
      Sentry.captureEvent({
        message: 'usePositionHandler-openTpSl-error',
        tags: {error},
      });
    }
  });

  return {
    openClosePosition,
    openTpSl,
  };
};
