/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';

/**
 * 用户限制弹窗
 */
const useUserLimit = ({ delay = false } = {}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user?.user);

  const { type } = user || {};
  // 显示限制弹窗与否 用户必须是 type 为1 才可以参加活动
  const initShowUserLimitedDialog = user && ![1].includes(type);

  const showUserLimitedDialog = useSelector(state => state.legoActivityPage.showUserLimitedDialog);

  const handleClose = useCallback(
    () => {
      dispatch({
        type: 'legoActivityPage/update',
        payload: {
          showUserLimitedDialog: false,
        },
      });
    },
    [dispatch],
  );

  const handleOpen = useCallback(
    () => {
      dispatch({
        type: 'legoActivityPage/update',
        payload: {
          showUserLimitedDialog: true,
        },
      });
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (initShowUserLimitedDialog) {
        setTimeout(() => {
          handleOpen();
        }, delay ? 800 : 0);
      }
    },
    [handleOpen, initShowUserLimitedDialog, delay],
  );

  return {
    handleClose,
    handleOpen,
    showUserLimitedDialog,
  };
};

export default useUserLimit;
