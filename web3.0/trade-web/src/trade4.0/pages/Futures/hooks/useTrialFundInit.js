/**
 * Owner: garuda@kupotech.com
 */
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { evtEmitter } from 'helper';
import { _t } from 'utils/lang';
import storage from 'utils/storage';

import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import {
  useSwitchTrialFund,
  useSymbolSupportTrialFund,
  useWatchHidden,
} from '@/hooks/futures/useFuturesTrialFund';

const event = evtEmitter.getEvt();
// 体验金初始化
const useTrialFundInit = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const { isAvailableTrialFund } = useSwitchTrialFund();
  const symbol = useGetCurrentSymbol();
  const isSupportCurrentSymbol = useSymbolSupportTrialFund(symbol);
  const watchHidden = useWatchHidden();

  const handleGetTrialFundDetail = useCallback(async () => {
    try {
      const data = await dispatch({
        type: 'futuresTrialFund/getTrialFund',
        payload: {
          status: 'ACTIVATE_FINISHED',
          pageSize: 5,
          currentPage: 1,
        },
      });
      if (data.success && data.data) {
        const { items = [], activateNum, availableNum } = data.data;
        dispatch({
          type: 'futuresTrialFund/update',
          payload: {
            trialFundDetail: { ...items[0], activateNum, availableNum },
            isHasTrialFund: Number(activateNum) > 0 || Number(availableNum) > 0,
            isAvailableTrialFund: Number(availableNum) > 0,
          },
        });
      }
    } catch (err) {
      const message = err.message || err.msg;
      dispatch({
        type: 'notice/feed',
        payload: {
          type: 'message.error',
          message: message || _t('trd.verify.init.fail'),
        },
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (isLogin) {
      handleGetTrialFundDetail();
    }
  }, [handleGetTrialFundDetail, isLogin]);

  const handleChangeHidden = useCallback(
    (v) => {
      console.log('changeHidden --->', v);
      dispatch({
        type: 'futuresTrialFund/update',
        payload: {
          isHidden: v,
        },
      });
    },
    [dispatch],
  );

  // 监听需要隐藏体验金的点击状态
  useEffect(() => {
    event.on('futures@watch_tradeForm_hidden', handleChangeHidden);
    return () => {
      event.off('futures@watch_tradeForm_hidden', handleChangeHidden);
    };
  }, [handleChangeHidden]);

  // 更新体验金开关本地存储状态
  useEffect(() => {
    if (
      isAvailableTrialFund &&
      isSupportCurrentSymbol &&
      !watchHidden
    ) {
      if (storage.getItem('switchTrialFund')) {
        dispatch({
          type: 'futuresTrialFund/update',
          payload: {
            switchTrialFund: storage.getItem('switchTrialFund'),
          },
        });
      }
    } else {
      dispatch({
        type: 'futuresTrialFund/update',
        payload: {
          switchTrialFund: false,
        },
      });
    }
  }, [isAvailableTrialFund, dispatch, isSupportCurrentSymbol, watchHidden]);
};

export default useTrialFundInit;
