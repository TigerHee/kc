/**
 * Owner: garuda@kupotech.com
 */
import { useCallback, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { forEach, filter, isEqual, reduce, intersection, uniq, difference } from 'lodash';

import { getState } from 'src/helper';
import { trackClick } from 'src/utils/ga';

import { _t } from 'utils/lang';

import { useCrossGrayScale } from '@/hooks/futures/useCrossGrayScale';
import { MARGIN_MODE_CROSS, MARGIN_MODE_ISOLATED } from '@/meta/futures';
import { MARGIN_MODE_MODULE } from '@/meta/futuresSensors/trade';
import { useOperatorResultPrompt } from '@/pages/Futures/components/ResultPromptDialog/hooks';

import {
  getAllAdvancedOrdersData,
  getAllOpenOrdersData,
  getAllPositionsData,
} from '../../../../hooks/futures/useGetFuturesPositionsInfo';

// 返回仓位模式
export const useMarginMode = () => {
  const dispatch = useDispatch();
  const marginModes = useSelector((state) => state.futuresMarginMode?.marginModeMap);

  const getMarginModes = useCallback(
    (params) => {
      dispatch({
        type: 'futuresMarginMode/getMarginModes',
        payload: {
          symbol: params,
        },
      });
    },
    [dispatch],
  );

  const getMarginModeForSymbol = useCallback(
    (symbol) => {
      return marginModes?.[symbol] || MARGIN_MODE_ISOLATED;
    },
    [marginModes],
  );

  return {
    marginModes,
    getMarginModeForSymbol,
    getMarginModes,
  };
};

// 返回当前用户支持切换的列表
export const useSupportMarginMode = () => {
  const { crossGrayScaleForSymbol } = useCrossGrayScale();
  const { getMarginModeForSymbol } = useMarginMode();

  // 获取是否支持切换
  const getSupportMarginModeForSymbol = useCallback(
    (symbol, needDefault = true) => {
      const symbolGrays = crossGrayScaleForSymbol(symbol);
      const marginMode = getMarginModeForSymbol(symbol);
      if (!symbol) {
        return needDefault ? false : undefined;
      }
      // FIXME: 这里需要兜底兼容一下，如果此时用户查询为全仓模式，这里需要返回支持
      // 主要为了防止灰度接口跟当前仓位模式接口有异常问题
      if (marginMode === MARGIN_MODE_CROSS) return true;
      if (!symbolGrays?.length) {
        return needDefault ? false : undefined;
      }
      return symbolGrays.includes(MARGIN_MODE_CROSS);
    },
    [crossGrayScaleForSymbol, getMarginModeForSymbol],
  );

  return {
    getSupportMarginModeForSymbol,
  };
};

// 返回能否切换模式
export const useCanChangeMarginMode = () => {
  const getHasOrders = useCallback(() => {
    const hasPositions = getAllPositionsData();
    const hasStopOrders = getAllAdvancedOrdersData();
    const hasActiveOrders = getAllOpenOrdersData();
    const allMap = {};
    console.log('hasPositions --->', hasPositions, hasStopOrders);
    forEach(hasPositions.concat(hasActiveOrders).concat(hasStopOrders), (item) => {
      // 需要判断一下仓位是不是开启的，并且需要过滤掉体验金
      if ((item.isOpen === undefined || item.isOpen) && !item.isTrialFunds) {
        allMap[item.symbol] = '1';
      }
    });
    return allMap;
  }, []);

  const getCanChangeMarginModeForSymbol = useCallback((symbol, hasOrders) => {
    console.log('get --->', symbol, hasOrders);
    return !hasOrders || (symbol && !hasOrders[symbol]);
  }, []);

  return {
    getHasOrders,
    getCanChangeMarginModeForSymbol,
  };
};

export const useMarginModeSelectProps = () => {
  const dispatch = useDispatch();
  const { onOpenDialog } = useOperatorResultPrompt();

  // 更改 symbol 的模式
  const onMarginModeChange = useCallback(
    async (v, updateSymbol) => {
      try {
        const { data } = await dispatch({
          type: 'futuresMarginMode/postMarginModeChange',
          payload: {
            marginMode: v,
            symbol: updateSymbol,
          },
        });
        if (data?.marginMode) {
          dispatch({
            type: 'futuresMarginMode/updateMarginModes',
            payload: data.marginMode,
          });
          // 这里做一个兜底兼容，主动切换 marginMode 成功之后，如果账务是冻结，则请求一次灰度接口跟资产接口
          const occupancyMode = getState((state) => state.futuresMarginMode.occupancyMode);
          if (!occupancyMode) {
            dispatch({
              type: 'grayScale/getCrossGrayScale',
              payload: {
                symbol: typeof updateSymbol === 'string' ? updateSymbol : updateSymbol[0],
              },
            });
            dispatch({ type: 'futuresAssets/pullOverview' });
          }
        }
        if (data?.errors?.length) {
          // onOpenDialog({
          //   type: 'warning',
          //   title: _t('futures.marginMode.settingError'),
          //   info: data.errors,
          // });
          dispatch({
            type: 'futuresMarginMode/update',
            payload: { marginModeError: data.errors },
          });
          trackClick([MARGIN_MODE_MODULE, v === MARGIN_MODE_ISOLATED ? '2' : '3'], {
            resultType: 'fail',
            fail_reason: data.errors || 'not network error',
          });
          return;
        }
        dispatch({
          type: 'notice/feed',
          payload: {
            type: 'message.success',
            message: _t('success'),
          },
        });
        trackClick([MARGIN_MODE_MODULE, v === MARGIN_MODE_ISOLATED ? '2' : '3'], {
          resultType: 'success',
        });
        console.log('data --->', data);
      } catch (err) {
        console.log('err --->', err);
        onOpenDialog({ type: 'warning', title: _t('kyc.auth.title'), content: _t('task.error') });
        trackClick([MARGIN_MODE_MODULE, v === MARGIN_MODE_ISOLATED ? '2' : '3'], {
          resultType: 'fail',
          fail_reason: err || 'network error',
        });
      } finally {
        // 关闭弹框
        dispatch({
          type: 'futuresMarginMode/update',
          payload: {
            modeDialogVisible: false,
          },
        });
      }
    },
    [dispatch, onOpenDialog],
  );

  return {
    onMarginModeChange,
  };
};

export const useMarginModeExplainDialogProps = () => {
  const dispatch = useDispatch();

  const explainDialogVisible = useSelector((state) => state.futuresMarginMode.explainDialogVisible);

  // 设置提示弹框的状态
  const onExplainDialogChange = useCallback(
    (v) => {
      dispatch({
        type: 'futuresMarginMode/update',
        payload: {
          explainDialogVisible: v,
        },
      });
    },
    [dispatch],
  );

  return {
    onExplainDialogChange,
    explainDialogVisible,
  };
};

export const useMarginModeDialogProps = () => {
  const [selects, setSelects] = useState([]);
  const [search, setSearch] = useState('');

  const dispatch = useDispatch();
  const modeDialogVisible = useSelector((state) => state.futuresMarginMode.modeDialogVisible);
  const switchMarginModes = useSelector((state) => state.futuresMarginMode.switchMarginModes);
  // const { supportMarginModes } = useSupportMarginMode();
  // const { getHasOrders, getCanChangeMarginModeForSymbol } = useCanChangeMarginMode();

  // 获取批量设置列表
  const getSwitchMarginModeList = useCallback(() => {
    dispatch({ type: 'futuresMarginMode/getSwitchMarginModes' });
  }, [dispatch]);

  // 获取是否存在订单或者仓位
  // const hasOrders = useMemo(() => {
  //   if (modeDialogVisible) {
  //     return getHasOrders();
  //   }
  // }, [getHasOrders, modeDialogVisible]);

  const marginModes = useMemo(() => {
    if (search?.trim()) {
      // 这里兼容一下 BTC 的搜索
      const searchStr = search.replace(/BTC/gi, 'XBT');
      return filter(
        switchMarginModes,
        (item) => item?.symbol?.indexOf(searchStr.toUpperCase()) > -1,
      );
    }
    return switchMarginModes;
  }, [search, switchMarginModes]);

  // 过滤能切换的 symbol 值
  const canChangeModes = useMemo(() => {
    return reduce(
      marginModes,
      (acc, item) => {
        if (item.switchable) {
          acc.push(item.symbol);
        }
        return acc;
      },
      [],
    );
  }, [marginModes]);

  // 是否为全选
  const isSelectAll = useMemo(() => {
    if (canChangeModes?.length) {
      return intersection(selects, canChangeModes)?.length >= canChangeModes?.length;
    }
    return false;
  }, [selects, canChangeModes]);

  // 设置仓位模式弹框的状态
  const onMarginModeDialogChange = useCallback(
    (v) => {
      dispatch({
        type: 'futuresMarginMode/update',
        payload: {
          modeDialogVisible: v,
        },
      });
    },
    [dispatch],
  );

  // 清空 search
  const handleClearSearch = useCallback(() => {
    setSearch('');
  }, []);

  // 清空 select
  const handleClearSelect = useCallback(() => {
    setSelects([]);
  }, []);

  // 设置 search
  const handleSetSearch = useCallback((e) => {
    const inputVal = e.target.value;
    setSearch(inputVal);
  }, []);

  // 选中 select all
  const handleChangeSelectAll = useCallback(
    (value) => {
      if (value) {
        setSelects(selects?.length ? uniq([...selects, ...canChangeModes]) : canChangeModes);
      } else if (search?.trim()) {
        setSelects(difference(selects, canChangeModes));
      } else {
        setSelects([]);
      }
    },
    [canChangeModes, search, selects],
  );

  // 设置选中
  const handleSetSelect = useCallback(
    (v, symbol) => {
      let shallowSelects = [...selects];
      if (!v) {
        shallowSelects = filter(shallowSelects, (item) => item !== symbol);
      } else {
        shallowSelects.push(symbol);
      }
      setSelects(shallowSelects);
    },
    [selects],
  );

  return {
    modeDialogVisible,
    onMarginModeDialogChange,
    search,
    selects,
    handleClearSearch,
    handleClearSelect,
    handleSetSearch,
    isSelectAll,
    handleChangeSelectAll,
    handleSetSelect,
    //  hasOrders,
    marginModes,
    getSwitchMarginModeList,
  };
};

// 返回 m 弹框的设置
export const useMarginModeMobileDialogProps = () => {
  const dispatch = useDispatch();
  const modeDialogVisible = useSelector((state) => state.futuresMarginMode.modeMobileDialogVisible);

  // 设置仓位模式弹框的状态
  const onMarginModeDialogChange = useCallback(
    (v) => {
      dispatch({
        type: 'futuresMarginMode/update',
        payload: {
          modeMobileDialogVisible: v,
        },
      });
    },
    [dispatch],
  );

  return {
    modeDialogVisible,
    onMarginModeDialogChange,
  };
};

// 低频率更新 - 返回仓位模式
export const getMarginMode = (symbol) => {
  const marginModes = getState((state) => state.futuresMarginMode.marginModeMap);

  return marginModes[symbol] || MARGIN_MODE_ISOLATED;
};

// 获取全仓是否开启过
export const useOpenedCross = () => {
  return useSelector((state) => state.futuresMarginMode.occupancyMode);
};

export const getOpenedCross = () => {
  return getState((state) => state.futuresMarginMode.occupancyMode);
};

// 错误展示弹框
export const useMarginModeError = () => {
  const dispatch = useDispatch();
  const marginModeError = useSelector((state) => state.futuresMarginMode.marginModeError);

  const onCloseModal = useCallback(() => {
    dispatch({
      type: 'futuresMarginMode/update',
      payload: {
        marginModeError: false,
      },
    });
  }, [dispatch]);

  // 拼接错误格式
  const errorInfo = useMemo(() => {
    const infos = {};
    if (marginModeError) {
      forEach(marginModeError, ({ code, msg, symbol }) => {
        if (infos[code]) {
          infos[code].symbols.push(symbol);
        } else {
          infos[code] = {
            msg,
            symbols: [symbol],
          };
        }
      });
    }
    return infos;
  }, [marginModeError]);

  return {
    open: !!marginModeError,
    errorInfo,
    onCloseModal,
    symbolKeys: Object.keys(marginModeError || []),
    errorInfoKeys: Object.keys(errorInfo),
  };
};
