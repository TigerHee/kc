/**
 * Owner: garuda@kupotech.com
 */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get, isEqual } from 'lodash';

// 获取用户是否有提取保证金权限
export const useGetWithdrawAvailable = () => {
  const dispatch = useDispatch();

  const getWithdrawAvailable = useCallback(() => {
    dispatch({
      type: 'futures_operator_margin/getWithdrawAvailable',
      payload: {
        featureType: 'withdrawMargin',
      },
    });
  }, [dispatch]);

  return getWithdrawAvailable;
};

// 请求用户最大可提取保证金
export const useOperatorMargin = () => {
  const dispatch = useDispatch();

  const getMaxWithdrawMargin = useCallback(
    (symbol) => {
      dispatch({ type: 'futures_operator_margin/getMaxWithdrawMargin', payload: { symbol } });
    },
    [dispatch],
  );

  const postOperatorMargin = useCallback(
    (params) => {
      return dispatch({ type: 'futures_operator_margin/postOperatorMargin', payload: params });
    },
    [dispatch],
  );

  return {
    getMaxWithdrawMargin,
    postOperatorMargin,
  };
};

// 获取是否显示提取保证金的功能
export const useShowWithdrawMargin = () => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const openContract = useSelector((state) => state.openFutures.openContract);
  const showWithdrawMargin = useSelector(
    (state) => state.futures_operator_margin.showWithdrawMargin,
  );

  return isLogin && openContract && showWithdrawMargin;
};

// 获取最大可提取保证金
export const useMaxWithdrawMargin = (symbol) => {
  const maxWithdrawMargin = useSelector((state) => {
    if (symbol) {
      return get(state.futures_operator_margin, `maxWithdrawMarginMap.${symbol}`, 0);
    }
    return state.futures_operator_margin.maxWithdrawMarginMap;
  }, isEqual);

  return maxWithdrawMargin;
};

// 提取保证金操作弹框
export const useOperatorMarginVisible = () => {
  const dispatch = useDispatch();
  const dialogVisible = useSelector((state) => state.futures_operator_margin.operatorMarginVisible);
  const loading = useSelector(
    (state) => state.loading.effects['futures_operator_margin/postOperatorMargin'],
  );

  const onChangeVisible = useCallback(
    (visible) => {
      dispatch({
        type: 'futures_operator_margin/update',
        payload: {
          operatorMarginVisible: visible,
        },
      });
    },
    [dispatch],
  );

  return {
    dialogVisible,
    onChangeVisible,
    loading,
  };
};

// 调整仓位真实杠杆弹框
export const useChangeRealLeverageVisible = () => {
  const dispatch = useDispatch();
  const dialogVisible = useSelector(
    (state) => state.futures_operator_margin.changeRealLeverageVisible,
  );
  const loading = useSelector(
    (state) => state.loading.effects['futures_operator_margin/postOperatorMargin'],
  );

  const onChangeVisible = useCallback(
    (visible) => {
      console.log('on change --->', visible);
      dispatch({
        type: 'futures_operator_margin/update',
        payload: {
          changeRealLeverageVisible: visible,
        },
      });
    },
    [dispatch],
  );

  return {
    dialogVisible,
    onChangeVisible,
    loading,
  };
};
