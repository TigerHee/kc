/**
 * Owner: garuda@kupotech.com
 */
import { useMemo, useCallback, useRef, useState, useEffect } from 'react';

import { useResponsive } from '@kux/mui/hooks';

import { useDispatch, useSelector } from 'dva';
import { debounce } from 'lodash';

import { trackClick } from 'utils/ga';
import { _t } from 'utils/lang';

import { greaterThan } from 'utils/operation';

import { useMainHost } from '@/hooks/common/useMainHost';
import { getPositionCalcData } from '@/hooks/futures/useCalcData';
import { getLastPrice } from '@/hooks/futures/useMarket';
import { BUY, SELL } from '@/meta/futures';
import {
  FUTURES_SHARE_PNL,
  FUTURES_SHARE_PNL_BTN,
  FUTURES_SHARE_PNL_ERROR,
  FUTURES_SHARE_PNL_CUSTOMER,
} from '@/meta/futuresSensors/trade';

import { formatCurrency } from '@/utils/futures';

export const useGetShareInfo = () => {
  return useSelector((state) => state.futuresCommon.shareInfo);
};

export const useSetShareInfo = () => {
  const dispatch = useDispatch();

  const setPositionShare = useCallback(
    async (data) => {
      const lastPrice = getLastPrice(data?.symbol);
      const type = greaterThan(data?.currentQty)(0) ? BUY : SELL;
      const calcData = getPositionCalcData(data?.symbol);
      // 体验金的仓位不需要计算，有推送
      const unPnl = data?.isTrialFunds ? data?.unrealisedPnl : calcData?.unPnl;
      const ROE = data?.isTrialFunds ? data?.unrealisedRoePcnt : calcData?.ROE;
      await dispatch({
        type: 'futuresCommon/update',
        payload: {
          shareInfo: {
            ...data,
            type,
            currentPrice: lastPrice,
            profit: unPnl,
            roe: ROE,
            currency: formatCurrency(data?.settleCurrency),
          },
        },
      });
    },
    [dispatch],
  );

  const setPnlShare = useCallback(
    async (info) => {
      let resultData = null;
      try {
        const result = await dispatch({
          type: 'futuresCommon/getPnlShareDetail',
          payload: {
            pnlId: info?.id,
            closeTime: info?.closeDate || info?.createdAt,
          },
        });
        if (result?.success) {
          resultData = result.data;
        } else {
          dispatch({
            type: 'notice/feed',
            payload: {
              type: 'message.info',
              message: _t('futures.pnlShare.historyError'),
            },
          });
        }
      } catch (err) {
        dispatch({
          type: 'notice/feed',
          payload: {
            type: 'message.info',
            message: _t('futures.pnlShare.historyError'),
          },
        });
        trackClick([FUTURES_SHARE_PNL_ERROR, '2'], { fail_reason: JSON.stringify(err) });
      } finally {
        dispatch({
          type: 'futuresCommon/update',
          payload: {
            shareInfo: {
              symbol: info?.symbol,
              type: info?.type?.match('LONG') ? BUY : SELL,
              profit: info?.realisedPnl,
              currency: formatCurrency(info?.currency),
              shareType: 'pnl',
              avgEntryPrice: resultData?.openPrice,
              closePrice: resultData?.closePrice,
              roe: resultData?.profitRate,
            },
          },
        });
      }
    },
    [dispatch],
  );

  return {
    setPositionShare,
    setPnlShare,
  };
};

export const useSetControlDisplay = () => {
  const dispatch = useDispatch();
  const changeDisplayName = useCallback(
    (value, isMobile) => {
      dispatch({
        type: 'futuresCommon/update',
        payload: {
          shareDisplayName: value,
        },
      });
      trackClick([FUTURES_SHARE_PNL_CUSTOMER, isMobile ? '2' : '1'], { selectType: 'userInfo' });
    },
    [dispatch],
  );

  const changeDisplayRoe = useCallback(
    (value, isMobile) => {
      dispatch({
        type: 'futuresCommon/update',
        payload: {
          shareDisplayProfit: value,
        },
      });
      trackClick([FUTURES_SHARE_PNL_CUSTOMER, isMobile ? '2' : '1'], { selectType: 'profit' });
    },
    [dispatch],
  );

  return {
    changeDisplayName,
    changeDisplayRoe,
  };
};

export const useGetControlDisplay = () => {
  const shareDisplayName = useSelector((state) => state.futuresCommon.shareDisplayName);
  const shareDisplayProfit = useSelector((state) => state.futuresCommon.shareDisplayProfit);

  return {
    shareDisplayName,
    shareDisplayProfit,
  };
};

export const useGetShareLink = () => {
  const shareInfo = useGetShareInfo();
  const mainHost = useMainHost();
  const userInfo = useSelector((state) => state.user.user);
  const baseShareInfo = useSelector((state) => state.futuresCommon.baseShareInfo);

  const shareLink = useMemo(() => {
    return `${mainHost}/futures/trade/${shareInfo?.symbol}`;
  }, [mainHost, shareInfo]);

  return {
    shareLink,
    shareLinkRCodeUtm: `${shareLink}?rcode=${
      baseShareInfo?.referralCode || userInfo?.referralCode
    }&utm_source=futuresPnl`,
    referralCode: baseShareInfo?.referralCode || userInfo?.referralCode,
  };
};

export const useMCustomer = () => {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.futuresCommon.posterCustomerVisible);
  const closeModal = useCallback(() => {
    dispatch({
      type: 'futuresCommon/update',
      payload: {
        posterCustomerVisible: false,
      },
    });
  }, [dispatch]);
  const openModal = useCallback(() => {
    dispatch({
      type: 'futuresCommon/update',
      payload: {
        posterCustomerVisible: true,
      },
    });
  }, [dispatch]);

  return {
    visible,
    closeModal,
    openModal,
  };
};

export const useModalProps = () => {
  const posterRef = useRef(null);
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.futuresCommon.posterVisible);
  const shareLoading = useSelector((state) => state.futuresCommon.shareLoading);

  const { xs, sm } = useResponsive();
  const isMobile = useMemo(() => xs && !sm, [sm, xs]);

  const [saveLoading, setSaveLoading] = useState(false);

  const { setPnlShare, setPositionShare } = useSetShareInfo();

  const updateLoading = useCallback(
    (v) => {
      dispatch({
        type: 'futuresCommon/update',
        payload: {
          shareLoading: v,
        },
      });
    },
    [dispatch],
  );

  const closeModal = useCallback(() => {
    dispatch({
      type: 'futuresCommon/update',
      payload: {
        posterVisible: false,
        shareInfo: null,
        shareLoading: false,
      },
    });
  }, [dispatch]);

  const openPositionShareModal = useCallback(
    (data) => {
      dispatch({
        type: 'futuresCommon/update',
        payload: {
          posterVisible: true,
        },
      });
      setPositionShare(data);
      trackClick([FUTURES_SHARE_PNL, '1'], {
        trade_pair: data?.symbol,
        trade_type: greaterThan(data?.currentQty)(0) ? BUY : SELL,
      });
    },
    [dispatch, setPositionShare],
  );

  const openPnlShareModal = useCallback(
    async (data) => {
      updateLoading(true);
      try {
        dispatch({
          type: 'futuresCommon/update',
          payload: {
            posterVisible: true,
          },
        });
        await setPnlShare(data);
        trackClick([FUTURES_SHARE_PNL, '2'], {
          trade_pair: data?.symbol,
          trade_type: data?.type?.match('LONG') ? BUY : SELL,
        });
      } finally {
        updateLoading(false);
      }
    },
    [dispatch, setPnlShare, updateLoading],
  );

  const onCopy = useCallback(() => {
    dispatch({
      type: 'notice/feed',
      payload: {
        type: 'message.success',
        message: _t('share.copySuccess'),
      },
    });
    trackClick([FUTURES_SHARE_PNL_BTN, '1'], { clickType: 'copy' });
  }, [dispatch]);

  const onSave = useCallback(
    debounce(async () => {
      if (posterRef?.current) {
        setSaveLoading(true);
        try {
          await posterRef.current.downloadImg();
        } catch (err) {
          dispatch({
            type: 'notice/feed',
            payload: {
              type: 'message.error',
              message: _t('share.posterError'),
            },
          });
          trackClick([FUTURES_SHARE_PNL_ERROR, '1'], { fail_reason: JSON.stringify(err) });
        } finally {
          setSaveLoading(false);
          trackClick([FUTURES_SHARE_PNL_BTN, '1'], { clickType: 'save' });
        }
      }
    }, 300),
    [],
  );

  const onShareClick = useCallback(({ data }) => {
    trackClick([FUTURES_SHARE_PNL_BTN, '1'], { clickType: data?.name || 'shareLink' });
  }, []);

  return {
    visible,
    closeModal,
    openPositionShareModal,
    openPnlShareModal,
    onCopy,
    onSave,
    posterRef,
    onShareClick,
    isMobile,
    loading: shareLoading,
    saveLoading,
  };
};

export const useGetBaseShareInfo = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.user);

  useEffect(() => {
    if (isLogin) {
      dispatch({ type: 'futuresCommon/getBaseShareInfo' });
    }
  }, [dispatch, isLogin]);
};
