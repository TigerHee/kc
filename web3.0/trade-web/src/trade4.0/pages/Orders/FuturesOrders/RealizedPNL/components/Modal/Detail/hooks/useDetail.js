/**
 * Owner: clyne@kupotech.com
 */
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { futuresPositionNameSpace as namespace } from '@/pages/Orders/FuturesOrders/config';

const loop = {};

const PAGE_SIZE = 10;

/**
 * useDetail
 */
export const useDetail = () => {
  const dispatch = useDispatch();
  const pnlDetailVisible = useSelector((state) => state[namespace].pnlDetailVisible);
  const pnlDetail = useSelector((state) => state[namespace].pnlDetail || loop);
  const { isTrialFunds, id } = pnlDetail;
  const fundsType = isTrialFunds ? 'trialFunds' : 'selfFunds';
  const onClose = useCallback(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        pnlDetailVisible: false,
        pnlDetail: {},
        closeDetails: {
          items: [],
          page: 0,
          count: 0,
        },
      },
    });
  }, [dispatch]);

  const handlePageChange = useCallback(
    (e, target) => {
      dispatch({
        type: `${namespace}/pullCloseDetail`,
        payload: {
          id,
          currentPage: target,
          pageSize: PAGE_SIZE,
          fundsType,
        },
      });
    },
    [dispatch, fundsType, id],
  );
  return { onClose, pnlDetail, pnlDetailVisible, handlePageChange };
};

/**
 * 初始化
 */
export const useInitDetail = () => {
  const dispatch = useDispatch();
  const pnlDetail = useSelector((state) => state[namespace].pnlDetail);
  const pnlDetailVisible = useSelector((state) => state[namespace].pnlDetailVisible);
  const { id, isTrialFunds } = pnlDetail;
  const fundsType = isTrialFunds ? 'trialFunds' : 'selfFunds';
  useEffect(() => {
    if (id && pnlDetailVisible) {
      dispatch({
        type: `${namespace}/pullCloseDetail`,
        payload: {
          id,
          currentPage: 1,
          pageSize: PAGE_SIZE,
          fundsType,
        },
      });
    }
  }, [id, fundsType, pnlDetailVisible, dispatch]);
};

/**
 * 打开pnl detail
 */
export const useOpenDetail = () => {
  const dispatch = useDispatch();
  const openDetail = useCallback(
    (item) => {
      dispatch({
        type: `${namespace}/update`,
        payload: {
          pnlDetailVisible: true,
          pnlDetail: item,
          closeDetails: {
            items: [],
            page: 0,
            count: 0,
          },
        },
      });
    },
    [dispatch],
  );
  return { openDetail };
};
